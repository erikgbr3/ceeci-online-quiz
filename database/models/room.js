'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Room.belongsTo(models.User, {
        as: 'UserRomm',
        foreignKey:'userId'
      })
      models.Room.hasMany(models.Result, {
        as: 'RoomResult',
        foreignKey:'roomId'
      })
      models.Room.hasMany(models.Bank, {
        as: 'RoomBank',
        foreignKey:'roomId'
      })
    }
  }
  Room.init({
    name: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};