'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Answer.belongsTo(models.Question, {
        as: 'AnswerQuestion',
        foreignKey:'questionId'
      })
      models.Answer.belongsTo(models.Option, {
        as: 'AnswerOption',
        foreignKey:'optionId'
      })
      models.Answer.hasMany(models.User, {
        as: 'AnswerUser',
        foreignKey:'userId'
      })
    }
  }
  Answer.init({
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    optionId: DataTypes.INTEGER,
    selection: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};