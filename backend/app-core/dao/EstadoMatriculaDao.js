const Models = require('../models/index');

const findByPkEstadoMatricula = id => {
    return Models.EstadoMatricula.findByPk(id);
};

const findOneEstadoMatriculaPorDescripcion = (descripcion, transaction = null) => {
    return Models.EstadoMatricula.findOne({
        where: {
            descripcion: descripcion,
        },
        transaction: transaction
    });
};

const findAllEstadoMatricula = () => {
    return Models.EstadoMatricula.findAll({});
};

const createEstadoMatricula = estadoMatricula => {
    return Models.EstadoMatricula.create(estadoMatricula);
};

const updateEstadoMatricula = (estadoMatricula, id) => {
    return Models.EstadoMatricula.update(estadoMatricula, {
        where: { id: id },
        returning: true
    });
};

const destroyEstadoMatricula = id => {
    return Models.EstadoMatricula.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkEstadoMatricula,
    findOneEstadoMatriculaPorDescripcion,
    findAllEstadoMatricula,
    createEstadoMatricula,
    updateEstadoMatricula,
    destroyEstadoMatricula
};