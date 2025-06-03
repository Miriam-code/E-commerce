const request = require('supertest');
const server = require('../../../server');
const { setupTestDb, teardownTestDb, setupTestUser } = require('./setup');
const db = require('../../../models');

describe('User API Endpoints', () => {
  let adminUser, adminToken, regularUser, userToken;

  beforeAll(async () => {
    await setupTestDb();
    const admin = await setupTestUser('admin');
    const user = await setupTestUser('user');
    
    adminUser = admin.user;
    adminToken = admin.token;
    regularUser = user.user;
    userToken = user.token;
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  // Test d'inscription d'un nouvel utilisateur
  describe('POST /user/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const res = await request(server)
        .post('/user/register')
        .send({
          username: 'newuser',
          email: 'usermimii@gmail.com',
          password: 'Test123!'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Utilisateur créé');
    });

    it('devrait rejeter une inscription avec email déjà utilisé', async () => {
      const res = await request(server)
        .post('/user/register')
        .send({
          username: 'newuser',
          email: 'usermimii@gmail.com', 
          password: 'Test123!'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', "Cet email existe déjà, veuillez-vous connecter.");
    });
  });

  // Test d'authentification
  describe('POST /user/auth', () => {
    it('devrait authentifier un utilisateur valide et retourner un token', async () => {
      const res = await request(server)
        .post('/user/auth')
        .send({
          email: 'usermimii@gmail.com',
          password: 'Test123!'
        });
        
    
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('devrait rejeter une authentification avec identifiants invalides', async () => {
      const res = await request(server)
        .post('/user/auth')
        .send({
          email: 'usermimii@gmail.com',
          password: 'WrongPassword!'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', "invalid password");
    });
  });

  // Test d'obtention du profil utilisateur
  // Correction du test pour GET /user/me
/*describe('GET /user/me', () => {
    let authToken;
  
    // S'authentifier avant d'exécuter les tests
    beforeEach(async () => {
      // Authentifier l'utilisateur et obtenir un nouveau token
      const authResponse = await request(server)
        .post('/user/auth')
        .send({
          email: 'usermimii@gmail.com',
          password: 'Test123!' // Utiliser le mot de passe défini dans setupTestUser
        });
      
      // Vérifier que l'authentification a réussi
      expect(authResponse.statusCode).toEqual(200);
      // Stocker le token pour les tests suivants
      authToken = authResponse.body.token;
    });
  
    it('devrait retourner le profil de l\'utilisateur connecté', async () => {
      const res = await request(server)
        .get('/user/me')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user');
    });
  
    it('devrait rejeter les requêtes non authentifiées', async () => {
      const res = await request(server)
        .get('/user/me');
      
      expect(res.statusCode).toEqual(401);
    });
  });

 /* //test pour PUT /user/:id
describe('PUT /user/:id', () => {
    let authToken;
  
    // S'authentifier avant d'exécuter les tests
    beforeEach(async () => {
      // Authentifier l'utilisateur et obtenir un nouveau token
      const authResponse = await request(server)
        .post('/user/auth')
        .send({
          email: 'usermimii@gmail.com',
          password: 'Test123!' // Utiliser le mot de passe défini dans setupTestUser
        });
      
      // Vérifier que l'authentification a réussi
      expect(authResponse.statusCode).toEqual(200);
      // Stocker le token pour les tests suivants
      authToken = authResponse.body.token;
    });
  
    it('devrait permettre à un utilisateur de mettre à jour son propre profil', async () => {
      const res = await request(server)
        .put(`/user/${regularUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nom: 'UpdatedNom',
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Profil mis à jour avec succès');
      
    });
  
    it('devrait permettre à un admin de mettre à jour n\'importe quel profil', async () => {
      // Authentifier l'admin
      const adminAuthResponse = await request(server)
        .post('/user/auth')
        .send({
          email: adminUser.email,
          password: 'Test123!' // Utiliser le mot de passe défini pour l'admin
        });
      
      expect(adminAuthResponse.statusCode).toEqual(200);
      const adminAuthToken = adminAuthResponse.body.token;
      
      const res = await request(server)
        .put(`/user/1`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          nom: 'AdminUpdated'
        });
      
      expect(res.statusCode).toEqual(200);
    });
  
    it('devrait rejeter la mise à jour d\'un profil par un autre utilisateur', async () => {
      // Créer un autre utilisateur standard
      const anotherUserSetup = await setupTestUser('another_user');
      const anotherUserAuthResponse = await request(server)
        .post('/user/auth')
        .send({
          email: anotherUserSetup.user.email,
          password: 'Test123!'
        });
      
      const anotherUserToken = anotherUserAuthResponse.body.token;
      
      const res = await request(server)
        .put(`/user/${regularUser.id}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send({
          username: 'hacked_username'
        });
      
      expect(res.statusCode).toEqual(403);
    });
  });

 /* // Test pour obtenir tous les utilisateurs (admin uniquement)
  describe('GET /user/get-all', () => {
    it('devrait permettre à un admin d\'obtenir la liste de tous les utilisateurs', async () => {
      const res = await request(server)
        .get('/user/get-all')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('devrait rejeter l\'accès à un utilisateur non-admin', async () => {
      const res = await request(server)
        .get('/user/get-all')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(403);
    });
  });

  /* Test de suppression d'un utilisateur
  describe('DELETE /user/:id', () => {

    it('devrait permettre à un admin de supprimer un utilisateur', async () => {
      const userToDelete = await db.Users.create({
        username: 'to_delete',
        email: 'delete@test.com',
        password: 'Password123!'
      });

      const res = await request(server)
        .delete(`/user/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      
      // Vérifier que l'utilisateur a bien été supprimé
      const deletedUser = await db.Users.findByPk(userToDelete.id);
      expect(deletedUser).toBeNull();
    });

    it('devrait permettre à un utilisateur de supprimer son propre compte', async () => {
      const selfDeleteUser = await setupTestUser('user');
      
      const res = await request(server)
        .delete(`/user/${selfDeleteUser.user.id}`)
        .set('Authorization', `Bearer ${selfDeleteUser.token}`);
      
      expect(res.statusCode).toEqual(200);
    });

    it('devrait rejeter la suppression d\'un autre utilisateur par un non-admin', async () => {
      const res = await request(server)
        .delete(`/user/${adminUser.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(403);
    });
  });*/
});