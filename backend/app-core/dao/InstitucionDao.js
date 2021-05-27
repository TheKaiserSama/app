const { Institucion, } = require('../models/index');

const findByPkInstitucion = id => {
    return Institucion.findByPk(id);
};

const findAllInstitucion = (transaction = null) => {
    return Institucion.findAll({
        transaction: transaction
    });
};

const createInstitucion = (institucion, transaction = null) => {
    return Institucion.create(institucion, {
        transaction: transaction
    });
};

const updateInstitucion = (institucion, id) => {
    return Institucion.update(institucion, {
        where: { id: id },
        returning: true
    });
};

module.exports = {
    findByPkInstitucion,
    findAllInstitucion,
    createInstitucion,
    updateInstitucion
};