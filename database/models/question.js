'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Question.belongsTo(models.Bank, {
        as: 'QuestionBank',
        foreignKey:'bankId'
      })
      models.Question.hasMany(models.Option, {
        as: 'QuestionOption',
        foreignKey:'questionId'
      })
      models.Question.hasMany(models.Answer, {
        as: 'QuestionAnswer',
        foreignKey:'questionId'
      })
    }
  }
  Question.init({
    textQuestion: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    bankId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};