const Models = require('../models/index');

const findByPkEstadoDocente = id => {
    return Models.EstadoDocente.findOne(id);
};

const findAllEstadoDocente = (transaction = null) => {
    return Models.EstadoDocente.findAll({
        order: [ ['descripcion', 'ASC'] ],
        transaction: transaction
    });
};

const findOrCreateEstadoDocente = estadoDocente => {
    return Models.EstadoDocente.findOrCreate({
        where: { descripcion: estadoDocente.descripcion },
        defaults: estadoDocente
    });
};

const createEstadoDocente = estadoDocente => {
    return Models.EstadoDocente.create(estadoDocente);
};

const updateEstadoDocente = (estadoDocente, id) => {
    return Models.EstadoDocente.update(estadoDocente, {
        where: { id: id },
        returning: true
    });
};

const destroyEstadoDocente = id => {
    return Models.EstadoDocente.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkEstadoDocente,
    findAllEstadoDocente,
    findOrCreateEstadoDocente,
    createEstadoDocente,
    updateEstadoDocente,
    destroyEstadoDocente
};