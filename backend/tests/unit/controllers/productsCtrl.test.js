const request = require('supertest');
const express = require('express');
const productsCtrl = require('../../../controllers/productsCtrl');
const models = require('../../../models');
const jwtUtils = require('../../../middleware/jwtUtils');

// Mock des dépendances
jest.mock('../../../models', () => ({
  Products: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
  }
}));

jest.mock('../../../middleware/jwtUtils', () => ({
  adminUser: jest.fn()
}));

// Configuration de l'application Express pour les tests
const app = express();
app.use(express.json());

// Ajout des routes pour tester le contrôleur
app.post('/api/products', (req, res, next) => {
  req.file = { filename: 'test-image.jpg' };
  next();
}, productsCtrl.create);

app.put('/api/products/:id', (req, res, next) => {
  req.file = { filename: 'updated-image.jpg' };
  next();
}, productsCtrl.update);

app.delete('/api/products/:id', productsCtrl.delete);
app.get('/api/products', productsCtrl.getAllProducts);
app.get('/api/products/:id', productsCtrl.getOneProduct);

describe('ProductsCtrl', () => {
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('devrait créer un produit avec succès quand utilisateur est admin', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(true);
      
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Product description',
        prix: 99.99,
        marque: 'Test Brand',
        genre: 'unisex',
        image: 'test-image.jpg'
      };
      
      models.Products.create.mockResolvedValue(mockProduct);

      // Action
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Test Product',
          description: 'Product description',
          prix: 99.99,
          marque: 'Test Brand',
          genre: 'unisex'
        });

      // Assertion
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Le produit a été créé.');
      expect(response.body.product).toEqual(mockProduct);
      expect(jwtUtils.adminUser).toHaveBeenCalledWith('Bearer fake-token');
      expect(models.Products.create).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Product description',
        prix: 99.99,
        marque: 'Test Brand',
        genre: 'unisex',
        image: 'test-image.jpg'
      });
    });

    test('devrait renvoyer une erreur 403 quand utilisateur n\'est pas admin', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(false);

      // Action
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Test Product',
          description: 'Product description',
          prix: 99.99,
          marque: 'Test Brand',
          genre: 'unisex'
        });

      // Assertion
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Vous n\'êtes pas autorisé à créer un produit.');
      expect(models.Products.create).not.toHaveBeenCalled();
    });

    test('devrait renvoyer une erreur 400 quand les champs requis sont manquants', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(true);

      // Action
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Test Product',
          // description manquant
          prix: 99.99,
          marque: 'Test Brand',
          genre: 'unisex'
        });

      // Assertion
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Veuillez remplir tous les champs.');
      expect(models.Products.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    test('devrait mettre à jour un produit avec succès quand utilisateur est admin', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(true);
      
      const existingProduct = {
        id: 1,
        name: 'Original Product',
        description: 'Original description',
        prix: 49.99,
        marque: 'Original Brand',
        genre: 'homme',
        image: 'original-image.jpg',
        update: jest.fn().mockResolvedValue(true)
      };
      
      models.Products.findOne.mockResolvedValue(existingProduct);

      const updatedProduct = {
        name: 'Updated Product',
        description: 'Updated description',
        prix: 59.99,
        marque: 'Updated Brand',
        genre: 'femme'
      };

      // Action
      const response = await request(app)
        .put('/api/products/1')
        .set('Authorization', 'Bearer fake-token')
        .send(updatedProduct);

      // Assertion
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Modification effectuée.');
      expect(existingProduct.update).toHaveBeenCalledWith({
        name: 'Updated Product',
        description: 'Updated description',
        prix: 59.99,
        marque: 'Updated Brand',
        genre: 'femme',
        image: 'updated-image.jpg'
      });
    });

    test('devrait renvoyer une erreur 403 quand utilisateur n\'est pas admin', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(false);

      // Action
      const response = await request(app)
        .put('/api/products/1')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Updated Product'
        });

      // Assertion
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Vous n\'êtes pas autorisé à modifier un produit.');
      expect(models.Products.findOne).not.toHaveBeenCalled();
    });

    test('devrait renvoyer une erreur 404 quand le produit n\'existe pas', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(true);
      models.Products.findOne.mockResolvedValue(null);

      // Action
      const response = await request(app)
        .put('/api/products/999')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Updated Product'
        });

      // Assertion
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Produit non trouvé.');
    });
  });

  describe('delete', () => {
    test('devrait supprimer un produit avec succès quand utilisateur est admin', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(true);
      
      const existingProduct = {
        id: 1,
        name: 'Product to delete',
        description: 'Description',
        prix: 29.99,
        marque: 'Brand',
        genre: 'unisex',
        image: 'image.jpg'
      };
      
      models.Products.findOne.mockResolvedValue(existingProduct);
      models.Products.destroy.mockResolvedValue(1);

      // Action
      const response = await request(app)
        .delete('/api/products/1')
        .set('Authorization', 'Bearer fake-token');

      // Assertion
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('post supprimé');
      expect(models.Products.destroy).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });

    test('devrait renvoyer une erreur 403 quand utilisateur n\'est pas admin', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(false);

      // Action
      const response = await request(app)
        .delete('/api/products/1')
        .set('Authorization', 'Bearer fake-token');

      // Assertion
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Vous n\'êtes pas autorisé à supprimer un produit.');
      expect(models.Products.findOne).not.toHaveBeenCalled();
    });

    test('devrait renvoyer une erreur 404 quand le produit n\'existe pas', async () => {
      // Arrangement
      jwtUtils.adminUser.mockReturnValue(true);
      models.Products.findOne.mockResolvedValue(null);

      // Action
      const response = await request(app)
        .delete('/api/products/999')
        .set('Authorization', 'Bearer fake-token');

      // Assertion
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Produit non trouvé.');
      expect(models.Products.destroy).not.toHaveBeenCalled();
    });
  });

  describe('getAllProducts', () => {
    test('devrait récupérer tous les produits avec succès', async () => {
      // Arrangement
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          prix: 19.99,
          marque: 'Brand 1',
          genre: 'homme',
          image: 'image1.jpg'
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description 2',
          prix: 29.99,
          marque: 'Brand 2',
          genre: 'femme',
          image: 'image2.jpg'
        }
      ];
      
      models.Products.findAll.mockResolvedValue(mockProducts);

      // Action
      const response = await request(app)
        .get('/api/products');

      // Assertion
      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProducts);
      expect(models.Products.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'name', 'description', 'prix', 'genre', 'marque', 'image']
      });
    });

    test('devrait gérer les erreurs serveur', async () => {
      // Arrangement
      models.Products.findAll.mockRejectedValue(new Error('Database error'));

      // Action
      const response = await request(app)
        .get('/api/products');

      // Assertion
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erreur de serveur interne');
    });
  });

  describe('getOneProduct', () => {
    test('devrait récupérer un produit spécifique avec succès', async () => {
      // Arrangement
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Product description',
        prix: 99.99,
        marque: 'Test Brand',
        genre: 'unisex',
        image: 'test-image.jpg'
      };
      
      models.Products.findOne.mockResolvedValue(mockProduct);

      // Action
      const response = await request(app)
        .get('/api/products/1');

      // Assertion
      expect(response.status).toBe(200);
      expect(response.body.product).toEqual(mockProduct);
      expect(models.Products.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        attributes: ['id', 'name', 'description', 'prix', 'genre', 'marque', 'image']
      });
    });

    test('devrait renvoyer une erreur 404 quand le produit n\'existe pas', async () => {
      // Arrangement
      models.Products.findOne.mockResolvedValue(null);

      // Action
      const response = await request(app)
        .get('/api/products/999');

      // Assertion
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Produit non trouvé.');
    });

    test('devrait gérer les erreurs serveur', async () => {
      // Arrangement
      models.Products.findOne.mockRejectedValue(new Error('Database error'));

      // Action
      const response = await request(app)
        .get('/api/products/1');

      // Assertion
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Une erreur est survenue.');
    });
  });
});