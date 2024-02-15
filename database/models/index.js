'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//Importar modelos
import user from './user';
import bank from './bank';
import result from './result';
import room from './room';
import question from './question';
import option from './option';
import answer from './answer';

db.User = user(sequelize, Sequelize.DataTypes);
db.Bank = bank(sequelize, Sequelize.DataTypes);
db.Result = result(sequelize, Sequelize.DataTypes);
db.Room = room(sequelize, Sequelize.DataTypes);
db.Question = question(sequelize, Sequelize.DataTypes);
db.Option = option(sequelize, Sequelize.DataTypes);
db.Answer = answer(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
