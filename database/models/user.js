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
      models.User.belongsTo(models.Room, {
        as: 'UserRoom',
        foreignKey:'userId'
      })
      models.User.hasMany(models.Answer, {
        as: 'UserAnswer',
        foreignKey:'userId'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  
  User.prototype.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }
  return User;
};