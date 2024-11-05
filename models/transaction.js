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
      const { Booking } = models;

      Transaction.belongsTo(Booking, {
        foreignKey: 'bookingId',
        as: 'booking'
      });
    }
  }
  Transaction.init({
    bookingId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Bookings',
        key: 'id'
      }
    },
    payment: {
      type: DataTypes.ENUM('transfer', 'wallet', 'cash'),
      defaultValue: 'transfer'
    },
    receipt: DataTypes.STRING,
    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      defaultValue: 'pending'
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};