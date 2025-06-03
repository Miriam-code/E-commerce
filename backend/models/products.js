'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Products.hasMany(models.OrderItems, { foreignKey: "productId" });
    }
  }
  Products.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.TEXT,
    prix: DataTypes.STRING,
    genre: DataTypes.STRING,
    marque: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Products',
    tableName: 'products',
  });
  return Products;
};