const { Sequelize } = require('sequelize');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const server = require('../../../server');
const db = require('../../../models');

// Config bd test 
const setupTestDb = async () => {
  await db.sequelize.sync({ force: true });
};

// Nettoyage de la base de données après les tests
const teardownTestDb = async () => {
  await db.sequelize.close();
};

console.log(Object.keys(db)); 

// Créer un utilisateur de test et générer un token JWT pour les tests
const setupTestUser = async (role = 'usermimii') => {
  const user = await db.Users.create({
    username: `test_${role}`,
    email: `${role}@gmail.com`,
    password: 'Test123!',
    role: role
  });
  
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.SECRET || 'test_secret',
    { expiresIn: '1h' }
  );
  
  return { user, token };
};

module.exports = {
  setupTestDb,
  teardownTestDb,
  setupTestUser
};