const Models = require('../models/index');

const findByPkSexo = id => {
    return Models.Sexo.findByPk(id);
};

const findAllSexo = () => {
    return Models.Sexo.findAll({});
};

module.exports = {
    findByPkSexo,
    findAllSexo
};