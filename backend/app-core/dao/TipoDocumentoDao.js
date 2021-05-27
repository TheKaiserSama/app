const Models = require('../models/index');

const findByPkTipoDocumento = id => {
    return Models.TipoDocumento.findByPk(id);
};

const findAllTipoDocumento = () => {
    return Models.TipoDocumento.findAll({});
};

module.exports = {
    findByPkTipoDocumento,
    findAllTipoDocumento
};