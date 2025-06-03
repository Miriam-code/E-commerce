// tests/unit/controllers/userCtrl.test.js
const userController = require('../../../controllers/usersCtrl');
const models = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtUtils = require("../../../middleware/jwtUtils");

// Mocks
jest.mock('../../../models', () => ({
  Users: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn((password, saltRounds, callback) => {
    callback(null, 'hashed_password');
  }),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake_token')
}));

jest.mock('../../../middleware/jwtUtils', () => ({
  getUser: jest.fn()
}));

describe('User Controller', () => {
  let req, res;
  
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('doit retourner une erreur si des champs sont vides', async () => {
      req.body = { nom: '', prenom: 'Doe', email: 'john@example.com', password: 'Password123!' };
      
      await userController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Veuillez remplir tous les champs.' });
    });

    test('doit rejeter les noms invalides', async () => {
      req.body = { nom: '123', prenom: 'Doe', email: 'john@example.com', password: 'Password123!' };
      
      await userController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Les noms ne sont pas valides. Ils doivent contenir uniquement des lettres et avoir une longueur de 3 à 15 caractères." 
      });
    });

    test('doit rejeter les mots de passe invalides', async () => {
      req.body = { nom: 'John', prenom: 'Doe', email: 'john@example.com', password: 'simple' };
      
      await userController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe invalide' });
    });

    test('doit rejeter les emails invalides', async () => {
      req.body = { nom: 'John', prenom: 'Doe', email: 'not_an_email', password: 'Password123!' };
      
      await userController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email invalide' });
    });

    test('doit créer un nouvel utilisateur avec succès', async () => {
      req.body = { 
        nom: 'John', 
        prenom: 'Doe', 
        email: 'john@example.com', 
        password: 'Password123!' 
      };
      
      models.Users.findOne.mockResolvedValue(null);
      models.Users.create.mockResolvedValue({
        id: 1,
        nom: 'John',
        prenom: 'Doe',
        email: 'john@example.com',
        is_admin: 0
      });
      
      await userController.register(req, res);
      
      expect(models.Users.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10, expect.any(Function));
      expect(models.Users.create).toHaveBeenCalledWith({
        nom: 'John',
        prenom: 'Doe',
        password: 'hashed_password',
        email: 'john@example.com',
        is_admin: 0
      });
      expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur créé' });
    });

    test('doit rejeter un email déjà existant', async () => {
      req.body = { 
        nom: 'John', 
        prenom: 'Doe', 
        email: 'existing@example.com', 
        password: 'Password123!' 
      };
      
      models.Users.findOne.mockResolvedValue({ id: 1, email: 'existing@example.com' });
      
      await userController.register(req, res);
      
      expect(models.Users.findOne).toHaveBeenCalledWith({ where: { email: 'existing@example.com' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cet email existe déjà, veuillez-vous connecter.' });
    });
  });

  describe('auth', () => {
    test('doit retourner une erreur si des champs sont vides', async () => {
      req.body = { email: '', password: 'Password123!' };
      
      await userController.auth(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Veuillez remplir tous les champs.' });
    });

    test('doit rejeter les mots de passe invalides', async () => {
      req.body = { email: 'john@example.com', password: 'simple' };
      
      await userController.auth(req, res);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'invalid password' });
    });

    test('doit rejeter les emails invalides', async () => {
      req.body = { email: 'not_an_email', password: 'Password123!' };
      
      await userController.auth(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'invalid email' });
    });

    test('doit authentifier un utilisateur avec succès', async () => {
      req.body = { email: 'john@example.com', password: 'Password123!' };
      
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        prenom: 'John',
        nom: 'Doe',
        password: 'hashed_password',
        is_admin: 0
      };
      
      models.Users.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      
      await userController.auth(req, res);
      
      expect(models.Users.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalledWith({
        id: 1,
        email: 'john@example.com',
        prenom: 'John',
        nom: 'Doe',
        is_admin: 0
      }, process.env.SECRET, { expiresIn: 36000 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'fake_token' });
    });

    test('doit rejeter un mot de passe incorrect', async () => {
      req.body = { email: 'john@example.com', password: 'Password123!' };
      
      models.Users.findOne.mockResolvedValue({ id: 1, email: 'john@example.com' });
      bcrypt.compare.mockResolvedValue(false);
      
      await userController.auth(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Password Incorrect' });
    });

    test('doit rejeter un utilisateur inexistant', async () => {
      req.body = { email: 'nonexistent@example.com', password: 'Password123!' };
      
      models.Users.findOne.mockResolvedValue(null);
      
      await userController.auth(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User n'exist pas" });
    });
  });

  describe('updateUser', () => {
    test('doit rejeter un mot de passe invalide', async () => {
      req.params = { id: 1 };
      req.body = { password: 'simple' };
      
      await userController.updateUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe invalide' });
    });

    test('doit mettre à jour un utilisateur avec nouveau mot de passe', async () => {
      req.params = { id: 1 };
      req.body = { 
        nom: 'UpdatedJohn', 
        prenom: 'UpdatedDoe', 
        email: 'updated@example.com',
        password: 'NewPassword123!'
      };
      
      const mockUser = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };
      
      models.Users.findOne.mockResolvedValue(mockUser);
      
      await userController.updateUser(req, res);
      
      expect(models.Users.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockUser.update).toHaveBeenCalledWith({
        nom: 'UpdatedJohn',
        prenom: 'UpdatedDoe',
        email: 'updated@example.com',
        password: 'hashed_password'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Modification effectuée' });
    });

    test('doit mettre à jour un utilisateur sans nouveau mot de passe', async () => {
      req.params = { id: 1 };
      req.body = { 
        nom: 'UpdatedJohn', 
        prenom: 'UpdatedDoe', 
        email: 'updated@example.com'
      };
      
      const mockUser = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };
      
      models.Users.findOne.mockResolvedValue(mockUser);
      
      await userController.updateUser(req, res);
      
      expect(models.Users.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUser.update).toHaveBeenCalledWith({
        nom: 'UpdatedJohn',
        prenom: 'UpdatedDoe',
        email: 'updated@example.com'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Modification effectuée' });
    });
  });

  describe('deleteUser', () => {
    test('doit supprimer un utilisateur existant', async () => {
      req.params = { id: 1 };
      
      models.Users.findOne.mockResolvedValue({ id: 1 });
      models.Users.destroy.mockResolvedValue(true);
      
      await userController.deleteUser(req, res);
      
      expect(models.Users.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(models.Users.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'utilisateur supprimé' });
    });
  });

  describe('getAllUsers', () => {
    test('doit retourner tous les utilisateurs', async () => {
      const mockUsers = [
        { id: 1, nom: 'John', prenom: 'Doe' },
        { id: 2, nom: 'Jane', prenom: 'Smith' }
      ];
      
      models.Users.findAll.mockResolvedValue(mockUsers);
      
      await userController.getAllUsers(req, res);
      
      expect(models.Users.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
    });
  });

  describe('getUserProfile', () => {
    test('doit retourner une erreur si aucun utilisateur n\'est trouvé', async () => {
      req.headers = { authorization: 'Bearer invalid_token' };
      
      jwtUtils.getUser.mockReturnValue(-1);
      
      await userController.getUserProfile(req, res);
      
      expect(jwtUtils.getUser).toHaveBeenCalledWith('Bearer invalid_token');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Aucun utilisateur' });
    });

    test('doit retourner le profil utilisateur', async () => {
      req.headers = { authorization: 'Bearer valid_token' };
      
      const mockUser = { id: 1, nom: 'John', prenom: 'Doe' };
      
      jwtUtils.getUser.mockReturnValue(1);
      models.Users.findOne.mockResolvedValue(mockUser);
      
      await userController.getUserProfile(req, res);
      
      expect(jwtUtils.getUser).toHaveBeenCalledWith('Bearer valid_token');
      expect(models.Users.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });
  });
});