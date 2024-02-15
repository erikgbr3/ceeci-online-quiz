'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Option.belongsTo(models.Question, {
        as: 'OptionQuestion',
        foreignKey:'questionId'
      })
      models.Option.hasMany(models.Answer, {
        as: 'OptionAnswer',
        foreignKey:'optionId',
      })
    }
  }
  Option.init({
      option1: DataTypes.STRING,
      option2: DataTypes.STRING,
      option3: DataTypes.STRING,
      correctA: DataTypes.STRING,
      questionId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Option',
  });
  return Option;
};