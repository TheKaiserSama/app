const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const Models = require('../../app-core/models/index');

const ValoracionCualitativaDao = require('../../app-core/dao/ValoracionCualitativaDao');
const response = require('../helpers/response');