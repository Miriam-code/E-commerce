const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtUtils = require("../middleware/jwtUtils");
require('dotenv').config({ path: './config/.env' });
const saltRounds = 10;
const validator = require('validator');
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

module.exports = {

    register: async (req, res) => {
        
        const { nom, prenom, email, password } = req.body;
        
        if (nom == "" || prenom == "" || email == "" || password == "") {
         return res.status(500).json({ message: "Veuillez remplir tous les champs." });
        }

       const nameRegex = /^[A-Za-z]{3,15}$/;
       if (!nameRegex.test(nom) || !nameRegex.test(prenom)) {
        return res.status(400).json({ message: "Les noms ne sont pas valides. Ils doivent contenir uniquement des lettres et avoir une longueur de 3 à 15 caractères." });}
        
        if (!regexPassword.test(password)) {
        return res.status(403).json({ message: "Mot de passe invalide" });}
        
        if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email invalide" });
        }
        
        try {
            // verification si l'email n'existe pas dans la base de données 
            const user = await models.Users.findOne({ where: { email: email } });
            // si aucun user est trouvé 
            if (user === null) {
                
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    
                    if (err) {
                    return res.status(500).json({ message: "Erreur serveur." });
                }
    
                const newUser = await models.Users.create({
                    nom: nom,
                    prenom: prenom,
                    password: hash,
                    email: email,
                    is_admin: 1
                });
                  
                if (newUser) {

                return res.status(200).json({ message: "Utilisateur créé." });
               } else {
                return res.status(500).json({ message: "Erreur serveur." });}
            });} else {
            return res.status(500).json({ message: "Cet email existe déjà, veuillez-vous connecter." });}

        } catch (error) {
        return res.status(500).json({ message: "Erreur serveur." });}
    },
    auth: async (req, res) => {

        const { email, password } = req.body;

        if (email == "" || password == "") {
            return res.status(500).json({ message: "Veuillez remplir tous les champs." });
        }
        if (!regexPassword.test(password)) {
            return res.status(403).json({ message: "invalid password" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "invalid email" })
        }

        const user = await models.Users.findOne({ where: { email: email } });

        if (user) {

            const password_valid = await bcrypt.compare(password, user.password);

            if (password_valid) {

                // Durée de validité du token (en secondes)
                const expirationTime = 36000;   
                token = jwt.sign({ "id": user.id, "email": user.email, "prenom": user.prenom, "nom": user.nom, "is_admin": user.is_admin }, process.env.SECRET, { expiresIn: expirationTime });
                return res.status(200).json({ token: token });
                
            } else {
                return res.status(400).json({ error: "Password Incorrect" });
            }
        } else {
            return res.status(404).json({ error: "User n'exist pas" });
        }
    },
    updateUser: async (req, res) => {

        const id = req.params.id;
        
        const { nom, prenom, email, password } = req.body;

        // Valider le nouveau mot de passe
        if (password && !regexPassword.test(password)) {
            return res.status(403).json({ message: "Mot de passe invalide" });
        }
    
        const user = await models.Users.findOne({ where: { id } });
    
        // Mettre à jour le mot de passe uniquement s'il est fourni et valide
        if (password) {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                await user.update({
                    nom: nom ? nom : user.nom,
                    prenom: prenom ? prenom : user.prenom,
                    email: email ? email : user.email,
                    password: hash
                }).then(() => {
                    return res.status(200).json({ message: "Modification effectuée" });
                }).catch((e) => {
                    return res.status(400).json({ message: "Erreur lors de la modification" });
                });
            });
        } else {
            // Si aucun nouveau mot de passe n'est fourni, mettez à jour les autres informations
            await user.update({
                nom: nom ? nom : user.nom,
                prenom: prenom ? prenom : user.prenom,
                email: email ? email : user.email
            }).then(() => {
                return res.status(200).json({ message: "Modification effectuée" });
            }).catch((e) => {
                return res.status(400).json({ message: "Erreur lors de la modification" });
            });
        }
    },
    deleteUser: async (req, res) => {
        const id = req.params.id;

        const user = await models.Users.findOne({ where: { id: id } });
        if (user) {
            await models.Users.destroy({
                where: { id: id }
            }).then(() => {
                return res.status(200).json({ message: "utilisateur supprimé" });
            }).catch((e) => {
                return res.status(400).json({ message: "erreur lors de la suppression" });
            })
        }
    },
    getAllUsers: async (req, res) => {
        await models.Users.findAll()
            .then((users) => {
                return res.status(200).json({ users: users })
            })
            .catch((e) => {
                return res.status(400).json({ message: "une erreur est survenue." })
            })
    },
    getUserProfile: async (req, res) => {
        const authorization = req.headers['authorization']
        
        const userId = jwtUtils.getUser(authorization); 

        if(userId == null || userId == -1) {
            return res.status(400).json({ message: "Aucun utilisateur" });
        }

        await models.Users.findOne({where: {id: userId}})
        .then((user) => {
            return res.status(200).json({ user: user });
        }).catch((e) => {
            return res.status(400).json({ message: "Utilisateur pas trouvé" });
        })
    }
};