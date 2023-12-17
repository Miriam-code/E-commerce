const models = require('../models');
const jwtUtils = require('../middleware/jwtUtils');

module.exports = {

    updateOrderProductsQuantity: async (req, res) => {
        try {
            const { orderId, orderItems } = req.body;
            const authorization = req.headers['authorization'];

            const userId = jwtUtils.getUser(authorization);

            if (!userId) {
                return res.status(401).json({ message: "Vous devez être connecté pour accéder à cette ressource." });
            }

            const order = await models.Orders.findOne({
                where: { id: orderId }
            });

            if (!order) {
                return res.status(404).json({ message: "Commande non trouvée." });
            }

            // Vérifier si l'utilisateur est l'admin ou le propriétaire de la commande
            if (userId !== order.userId && !jwtUtils.adminUser(authorization)) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à accéder aux éléments de cette commande." });
            }

            // Mettre à jour les quantités des produits de la commande
            for (const item of orderItems) {
                const orderItem = await models.OrderItems.findOne({
                    where: { id: item.orderItemId, orderId }
                });

                if (orderItem) {
                    await orderItem.update({ quantity: item.quantity });
                }
            }

            return res.status(200).json({ message: "Quantités des produits de la commande mises à jour avec succès." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour des quantités des produits de la commande." });
        }
    },
    
    deleteProductFromOrder: async (req, res) => {
        try {
            const { orderId, orderItemId } = req.params;
            const authorization = req.headers['authorization'];

            const userId = jwtUtils.getUser(authorization);

            if (!userId) {
                return res.status(401).json({ message: "Vous devez être connecté pour accéder à cette ressource." });
            }

            const order = await models.Orders.findOne({
                where: { id: orderId }
            });

            if (!order) {
                return res.status(404).json({ message: "Commande non trouvée." });
            }

            // Vérifier si l'utilisateur est l'admin ou le propriétaire de la commande
            if (userId !== order.userId && !jwtUtils.adminUser(authorization)) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer un produit de cette commande." });
            }

            // Supprimer le produit de la commande
            const deletedOrderItem = await models.OrderItems.destroy({
                where: { id: orderItemId, orderId }
            });

            if (!deletedOrderItem) {
                return res.status(404).json({ message: "Produit de la commande non trouvé." });
            }

            return res.status(200).json({ message: "Produit de la commande supprimé avec succès." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la suppression du produit de la commande." });
        }
    }
};