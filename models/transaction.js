'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  Transaction.associate = function (models) {
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'users'
    })

    Transaction.belongsTo(models.Item, {
      foreignKey: 'itemId',
      as: 'items'
    })

    Transaction.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'orders'
    })
  }

  return Transaction;
};