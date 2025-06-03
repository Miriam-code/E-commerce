const models = require('../models');
const jwtUtils = require('../middleware/jwtUtils');

module.exports = {

    create: async (req, res) => {

        try {
            const { userId, products } = req.body;
             
            // Vérifier si l'utilisateur existe
            const user = await models.Users.findOne({ where: { id: userId } });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé." });
            }

            const total = products.reduce((acc, product) => {

                const prixAsNumber = parseFloat(product.prix);

              
                if (!isNaN(prixAsNumber)) {
                  return  acc + prixAsNumber * product.quantity;
                } else {
                  console.error(`Le prix "${product.prix}" n'est pas un nombre valide.`);
                  return acc;
                }
            }, 0);

            // Créer la commande
            const order = await models.Orders.create({
                userId: userId,
                status: "En attente",
                total: total, 
            });

            // Ajouter les produits à la commande
            for (const product of products) {
                await models.OrderItems.create({
                    orderId: order.id,
                    productId: product.productId,
                    quantity: product.quantity
                });
            }

            return res.status(201).json({ message: "Commande créée avec succès.", order: order });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la création de la commande." });
        }
    },
    updateStatus: async (req, res) => {

        try {
            const { orderId, newStatus } = req.body;

            const authorization = req.headers['authorization'];

            if (!jwtUtils.adminUser(authorization)) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à mettre à jour le statut de la commande." });
            }

            const order = await models.Orders.findOne({ where: { id: orderId } });
            if (!order) {
                return res.status(404).json({ message: "Commande non trouvée." });
            }

            await order.update({ status: newStatus });
            return res.status(200).json({ message: "Statut de la commande mis à jour avec succès.", order: order });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour du statut de la commande." });
        }
    },
    delete: async (req, res) => {
        try {
            const { orderId } = req.params;
            const authorization = req.headers['authorization'];

            if (!jwtUtils.adminUser(authorization)) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette commande." });
            }

            const order = await models.Orders.findOne({ where: { id: orderId } });

            if (!order) {
                return res.status(404).json({ message: "Commande non trouvée." });
            }

            await models.OrderItems.destroy({ where: { orderId: order.id } });
            await order.destroy();

            return res.status(200).json({ message: "Commande supprimée avec succès." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la commande." });
        }
    },
    getAll: async (req, res) => {
        try {
            /*const authorization = req.headers['authorization'];

            if (!jwtUtils.adminUser(authorization)) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à accéder à cette ressource." });
            }*/

            const orders = await models.Orders.findAll({
                attributes: ['id', 'userId', 'status', 'createdAt'],
                include: [
                    {
                        model: models.OrderItems,
                        as: 'orderItems',
                        attributes: ['orderId', 'quantity'],
                        include: [
                            {
                                model: models.Products,
                                as: 'product',
                                attributes: ['name', 'description', 'prix', 'genre', 'marque', 'image']
                            }
                        ]
                    }
                ]
            });

            return res.status(200).json({ orders: orders });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la récupération des commandes." });
        }
    },
    getOne: async (req, res) => {
        try {
            const { orderId } = req.params;
            const authorization = req.headers['authorization'];

            const userId = jwtUtils.getUser(authorization);

            if (!userId) {
                return res.status(401).json({ message: "Vous devez être connecté pour accéder à cette ressource." });
            }

            const order = await models.Orders.findOne({
                where: { id: orderId },
                attributes: ['id', 'userId', 'status', 'createdAt'],
                include: [
                    {
                        model: models.OrderItems,
                        as: 'orderItems',
                        attributes: ['productId', 'quantity'],
                        include: [
                            {
                                model: models.Products,
                                as: 'product',
                                attributes: ['name', 'description', 'prix', 'genre', 'marque', 'image']
                            }
                        ]
                    }
                ]
            });

            if (!order) {
                return res.status(404).json({ message: "Commande non trouvée." });
            }

            if (userId !== order.userId && !jwtUtils.adminUser(authorization)) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à accéder à cette commande." });
            }

            return res.status(200).json({ order : order });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la récupération de la commande." });
        }
    },
    getOrdersUser : async (req, res) => {

        try {
            
          const userId = req.params.id
      
          const myOrders = await models.Orders.findAll({
            where: { userId : userId },
            attributes: ['id', 'status','total','createdAt'],
            include: [
              {
                model: models.OrderItems,
                attributes: ['productId', 'quantity'],
                include: [
                  {
                    model: models.Products,
                    attributes: ['name', 'description', 'prix', 'genre', 'marque', 'image'],
                  },
                ],
              },
            ],
          });

          
      
          return res.status(200).json({ orders: myOrders });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Une erreur est survenue lors de la récupération des commandes de l'utilisateur." });
        }
    }  
};
