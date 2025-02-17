"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Booking } = models;

      User.hasMany(Booking, {
        foreignKey: "userId",
        as: "bookings",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("customer", "karyawan"),
        defaultValue: "customer",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
