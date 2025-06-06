'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.OrderItems.belongsTo(models.Orders, { foreignKey: "orderId" }); // Relation many-to-one avec Orders
      models.OrderItems.belongsTo(models.Products, { foreignKey: "productId" }); // Relation many-to-one avec Products

    }
  }
  OrderItems.init({
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderItems',
    tableName: 'orderitems',
  });
  return OrderItems;
};