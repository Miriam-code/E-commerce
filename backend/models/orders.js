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
    userId: DataTypes.NUMBER,
    total: DataTypes.NUMBER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};