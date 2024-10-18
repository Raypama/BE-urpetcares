'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    // Ambil referensi ke model User, Service, dan Transaction dari objek models
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    const { User, Service, Transaction } = models;
      // define association here
      Booking.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Booking.belongsTo(Service, {
        foreignKey: 'serviceId',
        as: 'service'
      });
      Booking.hasOne(Transaction, {
        foreignKey: 'bookingId',
        as: 'transaction'
      });
    }
  }
  Booking.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    serviceId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Services',
        key: 'id'
      }
    },
    date: DataTypes.DATE,
    time: {
      type: DataTypes.STRING,  //Menggunakan STRING untuk menyimpan waktu tanpa detik
      allowNull: false,
      validate: {
        is: /^([0-1]\d|2[0-3]):([0-5]\d)$/  
        //Validasi format 'HH:mm' (tanpa detik)
      }
    },
    quantity: DataTypes.INTEGER,
    totalPrice: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM('pending', 'upcoming', 'ongoing', 'complete', 'cancelled'),
      defaultValue: 'pending'
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};