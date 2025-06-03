'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Orders.hasMany(models.OrderItems, { foreignKey: "orderId" }); 
      models.Orders.belongsTo(models.Users, { foreignKey: "userId" }); // Relation many-to-one avec Users

    }
  }
  Orders.init({
    userId: DataTypes.INTEGER,
    total: DataTypes.TEXT,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Orders',
    tableName: 'orders',
  });
  return Orders;
};