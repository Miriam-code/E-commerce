// server
const express = require('express');
const server = express();

const path = require('path');
require('dotenv').config({ path: './config/.env' });

// importer les routes
const routesUsers = require('./routes/usersRoutes');
const routesProducts = require('./routes/productsRoutes');
const routesOrders = require('./routes/ordersRoutes');
const routesItems = require('./routes/ordersItems');

//
const bodyParser = require('body-parser');
const cors = require('cors');

// crud admin 
const { default: crud } = require('express-crud-router');
const models = require('./models');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(cors({origin: 'http://localhost:3001'}))

server.use('/public', express.static(path.join(__dirname, '/public')))

// routes
server.use('/user', routesUsers);
server.use('/product', routesProducts);
server.use('/order', routesOrders);
server.use('/items', routesItems);


// crud admin users
server.use(
  crud('/admin/users', {
    getList: ({ filter, limit, offset, order }) =>
        models.Users.findAndCountAll({ limit, offset, order, where: filter }),
    getOne: id => models.Users.findByPk(id),
    create: body => models.Users.create(body),
    update: (id, body, {req, res}) => models.Users.update(body, { where: { id } }).then(() => res.status(200).json({id, ...body})),
    destroy: id => models.Users.destroy({ where: { id } })
  })
)
// crud admin Products

const { imageUpload } = require('./middleware/multer');

server.post('/admin/products', imageUpload.single('image'), async (req, res, next) => {

  try {
    // Vérifiez si Multer a rencontré une erreur
    if (req.fileValidationError) {
      return res.status(400).json({ error: 'Erreur de validation du fichier.' });
    }

    const { name, description, prix, genre, marque } = req.body;

    const imagePath = req.file ? req.file.filename : null; // Vérifiez si un fichier a été téléchargé

    
    const product = await models.Products.create({
      name,
      description,
      prix,
      genre,
      marque,
      image: imagePath, 
    });
    
    res.status(201).json(product);
  } catch (error) {

    console.error(error);
    res
      .status(500)
      .json({ error: 'Une erreur est survenue lors de la création du produit.' });
  }
});

server.use(
  crud('/admin/products', {
    getList: ({ filter, limit, offset, order }) =>
        models.Products.findAndCountAll({ limit, offset, order, where: filter }),
    getOne: id => models.Products.findByPk(id),
    update: (id, body, {req, res}) => models.Products.update(body, { where: { id } }).then(() => res.status(200).json({id, ...body})),
    destroy: id => models.Products.destroy({ where: { id } })
  })
)

// crud admin Orders
server.use(
  crud('/admin/orders', {
    getList: ({ filter, limit, offset, order }) =>
        models.Orders.findAndCountAll({ limit, offset, order, where: filter}),
    getOne: id => models.Orders.findByPk(id),
    create: body => models.Orders.create(body),
    update: (id, body, {req, res}) => models.Orders.update(body, { where: { id } }).then(() => res.status(200).json({id, ...body})),
    destroy: id => models.Orders.destroy({ where: { id } })
  })
)

// crud admin items 
server.use(
  crud('/admin/ordersItems', {
    getList: ({ filter, limit, offset, order }) =>
        models.OrderItems.findAndCountAll({ limit, offset, order, where: filter}),
    getOne: id => models.OrderItems.findByPk(id),
    create: body => models.OrderItems.create(body),
    update: (id, body, {req, res}) => models.OrderItems.update(body, { where: { id } }).then(() => res.status(200).json({id, ...body})),
    destroy: id => models.OrderItems.destroy({ where: { id } })
  })
)



server.listen(process.env.PORT, () => {
    console.log(`écoute du port ${process.env.PORT}`)
});