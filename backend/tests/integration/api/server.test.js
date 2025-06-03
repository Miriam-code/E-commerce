const request = require('supertest');
const server = require('../../../server');
const db = require('../../../models');
const { setupTestDb, teardownTestDb, setupTestUser } = require('./setup');

  let adminUser, adminToken, regularUser, userToken;

  beforeAll(async () => {
    await setupTestDb();
    const admin = await setupTestUser(1);
    const user = await setupTestUser('user');
    
    adminUser = admin.user;
    adminToken = admin.token;
    regularUser = user.user;
    userToken = user.token;
  });

  afterAll(async () => {
    await teardownTestDb();
  });



describe('Server - Endpoints principaux', () => {

  test('GET /public doit retourner 404 si fichier statique non trouvé', async () => {
    const res = await request(server).get('/public/image-introuvable.jpg');
    expect(res.status).toBe(404);
  });

  test('GET /user', async () => {
    const res = await request(server).get('/user/get-all');
    expect([200, 204]).toContain(res.statusCode);
  });

  test('GET /product', async () => {
    const res = await request(server).get('/product/get-all');
    expect([200, 204]).toContain(res.statusCode);
  });



  test('POST /admin/products avec image valide', async () => {
    const res = await request(server)
      .post('/admin/products')
      .field('name', 'Produit test')
      .field('description', 'Description test')
      .field('prix', '29.99')
      .field('genre', 'Unisexe')
      .field('marque', 'TestMarque');
  
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('name', 'Produit test');
  });
  
});

describe(' Admin CRUD', () => {
    test('POST /admin/users doit créer un utilisateur', async () => {
      const res = await request(server)
        .post('/admin/users')
        .send({
          username: 'testadmin',
          email: 'admin@test.com',
          password: 'Test123!',
          role: 'admin'
        });
      expect(res.status).toBe(201); // express-crud-router retourne 200 même pour POST
      expect(res.body).toHaveProperty('email', 'admin@test.com');
    });
  
    test('GET /admin/users recupérer all users', async () => {
      const res = await request(server).get('/admin/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true); // vérifie que c’est bien un tableau
      expect(res.body.length).toBeGreaterThanOrEqual(0); // accepte même si vide
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('email');
      }
    });

    test('GET /admin/products retourne une liste', async () => {
      const res = await request(server).get('/admin/products');
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });


  });
  