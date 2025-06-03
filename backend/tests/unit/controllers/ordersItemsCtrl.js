const request = require('supertest');
const app = require('../../../server'); // adapte si ton point d'entrée est différent
const models = require('../../../backend/models');
const jwtUtils = require('../../../backend/middleware/jwtUtils');

describe('OrderItems Controller', () => {
  let token;
  let user;
  let order;
  let orderItem;

  beforeAll(async () => {
    // Crée un utilisateur
    user = await models.Users.create({
      email: 'testuser@example.com',
      password: 'Test123!', // supposé hashé dans middleware
    });

    // Génère un token JWT pour ce user
    token = jwtUtils.generateTokenForUser(user);

    // Crée une commande
    order = await models.Orders.create({
      userId: user.id,
      status: 'en_attente',
    });

    // Crée un produit
    const product = await models.Products.create({
      name: 'Produit test',
      prix: 19.99,
      genre: 'Unisexe',
      marque: 'Test',
      description: 'Un produit test',
    });

    // Ajoute un produit à la commande
    orderItem = await models.OrderItems.create({
      orderId: order.id,
      productId: product.id,
      quantity: 2,
    });
  });

  afterAll(async () => {
    await models.OrderItems.destroy({ where: {} });
    await models.Products.destroy({ where: {} });
    await models.Orders.destroy({ where: {} });
    await models.Users.destroy({ where: {} });
  });

  test('PUT /order/update-quantities - met à jour les quantités d’un produit', async () => {
    const res = await request(app)
      .put('/order/update-quantities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderId: order.id,
        orderItems: [
          {
            orderItemId: orderItem.id,
            quantity: 5,
          },
        ],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Quantités des produits de la commande mises à jour avec succès');

    // Vérifie en DB
    const updatedItem = await models.OrderItems.findByPk(orderItem.id);
    expect(updatedItem.quantity).toBe(5);
  });

  test('DELETE /order/:orderId/item/:orderItemId - supprime un produit de la commande', async () => {
    const res = await request(app)
      .delete(`/order/${order.id}/item/${orderItem.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Produit de la commande supprimé avec succès');

    // Vérifie en DB
    const deletedItem = await models.OrderItems.findByPk(orderItem.id);
    expect(deletedItem).toBeNull();
  });
});
