const jwtUtils = require('../middleware/jwtUtils');
const models = require('../models');

module.exports = {
    
    create: async (req, res) => {

        const { name, description, prix, genre, marque } = req.body;
        const authorization = req.headers['authorization'];
        const userAdmin = jwtUtils.adminUser(authorization);
        const image = req.file;
    
        if (!userAdmin) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à créer un produit." });
        }
    
        if (!name || !description || !prix || !genre || !marque) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs." });
        }
    
        try {
            console.log(image.filename)
            const newProduct = await models.Products.create({
                name,
                description,
                image: image ? image.filename : 'test.png',
                prix,
                genre,
                marque,
            });
    
            return res.status(201).json({ message: 'Le produit a été créé.', product: newProduct });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la création du produit." });
        }
    },    

    update: async (req, res) => {

        const id = req.params.id;
        const {name, description,prix,genre,marque} = req.body;
        const image = req.file;
        const authorization = req.headers['authorization'];
        const userAdmin = jwtUtils.adminUser(authorization);

        if (!userAdmin) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier un produit." });
        }

        if (name === "" && description === "" && prix === "" && image === null) {
            return res.status(500).json({ message: "Veuillez remplir tous les champs." });
        }

        const product = await models.Products.findOne({
            attributes: ['id', 'name', 'description', 'prix', 'genre','marque','image'],
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }

        const updatedFields = {

            name: name ? name : product.title,
            description: description ? description : product.description,
            prix: prix ? prix : product.prix,
            marque: marque ? marque : product.marque,
            genre: genre ? genre : product.genre,
            image: image ? image.filename : product.image

        };

        try {
            await product.update(updatedFields);
            return res.status(200).json({ message: "Modification effectuée.", product: product});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erreur lors de la modification." });
        }
    },

    delete: async (req, res) => {

        const id = req.params.id;

        const authorization = req.headers['authorization'];
        const userAdmin = jwtUtils.adminUser(authorization);

        if (!userAdmin) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer un produit." });
        }
        
        const product = await models.Products.findOne({
            attributes: ['id', 'name', 'description', 'prix', 'genre','marque','image'],
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }

        if (product) {
            await models.Products.destroy({
                where: { id: id }
            }).then(() => {
                return res.status(200).json({ message: "post supprimé" });
            }).catch((e) => {
                return res.status(400).json({ message: "erreur lors de la suppression" });
            })
        }
    },

    getAllProducts: async (req, res) => {

        try {
            const products = await models.Products.findAll({ 
                attributes: ['id', 'name', 'description', 'prix', 'genre', 'marque', 'image'],
            });
        
            return res.status(200).json({ products: products });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erreur de serveur interne" });
        }
    },
    
    getOneProduct: async (req, res) => {

        const productId = req.params.id;
    
        try {
            const product = await models.Products.findOne({
                where: { id: productId },
                attributes: ['id', 'name', 'description', 'prix', 'genre', 'marque', 'image'],
            });
    
            if (!product) {
                return res.status(404).json({ message: "Produit non trouvé." });
            }
    
            return res.status(200).json({ product : product });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue." });
        }
    }
    
}