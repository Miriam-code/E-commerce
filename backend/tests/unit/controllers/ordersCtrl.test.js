const request = require('supertest');
const express = require('express');
const ordersCtrl = require('../../../controllers/ordersCtrl');
const models = require('../../../models');
const jwtUtils = require('../../../middleware/jwtUtils');

// Mocks
jest.mock('../../../models', () => ({
  Users: { findOne: jest.fn() },
  Orders: { create: jest.fn(), findOne: jest.fn(), findAll: jest.fn(), destroy: jest.fn() },
  OrderItems: { create: jest.fn(), destroy: jest.fn() },
  Products: {}
}));
jest.mock('../../../middleware/jwtUtils', () => ({
  adminUser: jest.fn(),
  getUser: jest.fn()
}));

const app = express();
app.use(express.json());
app.post('/api/orders', ordersCtrl.create);
app.put('/api/orders/status', ordersCtrl.updateStatus);
app.delete('/api/orders/:orderId', ordersCtrl.delete);
app.get('/api/orders', ordersCtrl.getAll);
app.get('/api/orders/:orderId', ordersCtrl.getOne);
app.get('/api/orders/user/:id', ordersCtrl.getOrdersUser);

describe('OrdersCtrl', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('create', () => {
    test('doit créer une commande avec succès', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      models.Users.findOne.mockResolvedValue(mockUser);

      const total = 2 * 49.99 + 1 * 50.0;
      const mockOrder = { id: 1, userId: 1, status: 'En attente', total: total.toFixed(2) };
      models.Orders.create.mockResolvedValue(mockOrder);
      models.OrderItems.create.mockResolvedValue({});

      const orderData = {
        userId: 1,
        products: [
          { productId: 1, quantity: 2, prix: '49.99' },
          { productId: 2, quantity: 1, prix: '50.00' }
        ]
      };

      const response = await request(app).post('/api/orders').send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Commande créée avec succès.');
      expect(parseFloat(response.body.order.total)).toBeCloseTo(149.98, 2);
      expect(models.Users.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(models.Orders.create).toHaveBeenCalledWith({
        userId: 1,
        status: 'En attente',
        total: expect.closeTo(149.98, 2)
      });
      expect(models.OrderItems.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAll', () => {
    test('doit récupérer toutes les commandes quand utilisateur est admin', async () => {
      jwtUtils.adminUser.mockReturnValue(true);

      const now = new Date();
      const mockOrders = [{
        id: 1,
        userId: 1,
        status: 'En attente',
        createdAt: now,
        orderItems: [{
          orderId: 1,
          quantity: 2,
          product: {
            name: 'Product 1',
            description: 'Description 1',
            prix: 49.99,
            genre: 'homme',
            marque: 'Brand 1',
            image: 'image1.jpg'
          }
        }]
      }];

      models.Orders.findAll.mockResolvedValue(mockOrders);

      const response = await request(app).get('/api/orders').set('Authorization', 'Bearer token');
      expect(response.status).toBe(200);

      const expectedOrders = mockOrders.map(order => ({
        ...order,
        createdAt: order.createdAt.toISOString()
      }));

      const receivedOrders = response.body.orders.map(order => ({
        ...order,
        createdAt: new Date(order.createdAt).toISOString()
      }));

      expect(receivedOrders).toEqual(expectedOrders);
    });
  });

  describe('getOne', () => {
    test('doit récupérer une commande spécifique quand utilisateur est le propriétaire', async () => {
      jwtUtils.getUser.mockReturnValue(1);
      jwtUtils.adminUser.mockReturnValue(false);

      const now = new Date();
      const mockOrder = {
        id: 1,
        userId: 1,
        status: 'En attente',
        createdAt: now,
        orderItems: [{
          productId: 1,
          quantity: 2,
          product: {
            name: 'Product 1',
            description: 'Description 1',
            prix: 49.99,
            genre: 'homme',
            marque: 'Brand 1',
            image: 'image1.jpg'
          }
        }]
      };

      models.Orders.findOne.mockResolvedValue(mockOrder);

      const response = await request(app).get('/api/orders/1').set('Authorization', 'Bearer token');
      expect(response.status).toBe(200);

      const expectedOrder = JSON.parse(JSON.stringify(mockOrder));
      expectedOrder.createdAt = mockOrder.createdAt.toISOString();
      const receivedOrder = {
        ...response.body.order,
        createdAt: new Date(response.body.order.createdAt).toISOString()
      };

      expect(receivedOrder).toEqual(expectedOrder);
    });

    test('doit récupérer une commande spécifique quand utilisateur est admin', async () => {
      jwtUtils.getUser.mockReturnValue(2);
      jwtUtils.adminUser.mockReturnValue(true);

      const now = new Date();
      const mockOrder = {
        id: 1,
        userId: 1,
        status: 'En attente',
        createdAt: now,
        orderItems: []
      };

      models.Orders.findOne.mockResolvedValue(mockOrder);

      const response = await request(app).get('/api/orders/1').set('Authorization', 'Bearer token');
      expect(response.status).toBe(200);

      const expectedOrder = { ...mockOrder, createdAt: now.toISOString() };
      const receivedOrder = { ...response.body.order, createdAt: new Date(response.body.order.createdAt).toISOString() };

      expect(receivedOrder).toEqual(expectedOrder);
    });
  });

  describe('getOrdersUser', () => {
    test('doit récupérer toutes les commandes d\'un utilisateur', async () => {
      const now = new Date();
      const mockOrders = [{
        id: 1,
        status: 'En attente',
        total: '149.97',
        createdAt: now,
        orderItems: [{
          product: {
            name: 'Product 1',
            description: 'Description 1',
            prix: 49.99,
            genre: 'homme',
            marque: 'Brand 1',
            image: 'image1.jpg'
          }
        }]
      }];
      models.Orders.findAll.mockResolvedValue(mockOrders);

      const response = await request(app).get('/api/orders/user/1');

      expect(response.status).toBe(200);

      const expectedOrders = mockOrders.map(o => ({
        ...o,
        createdAt: o.createdAt.toISOString()
      }));

      const receivedOrders = response.body.orders.map(o => ({
        ...o,
        createdAt: new Date(o.createdAt).toISOString()
      }));

      expect(receivedOrders).toEqual(expectedOrders);
    });
  });
});
