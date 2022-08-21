'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    token: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    isExpired: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = function(models) {
    User.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'orders'
    })

    User.hasMany(models.Transaction, {
      foreignKey: 'userId',
      as: 'transactions'
    })

    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile'
    })
  }
  return User;
};