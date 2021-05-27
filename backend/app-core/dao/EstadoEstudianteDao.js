const Models = require('../models/index');

const findByPkEstadoEstudiante = id => {
    return Models.EstadoEstudiante.findByPk(id);
};

const findOneEstadoEstudiantePorDescripcion = (descripcion, transaction = null) => {
    return Models.EstadoEstudiante.findOne({
        where: {
            descripcion: descripcion,
        },
        transaction: transaction
    });
};

const findAllEstadoEstudiante = () => {
    return Models.EstadoEstudiante.findAll({});
};

const createEstadoEstudiante = estadoEstudiante => {
    return Models.EstadoEstudiante.create(estadoEstudiante);
};

const updateEstadoEstudiante = (estadoEstudiante, id) => {
    return Models.EstadoEstudiante.update(estadoEstudiante, {
        where: { id: id },
        returning: true
    });
};

const destroyEstadoEstudiante = id => {
    return Models.EstadoEstudiante.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkEstadoEstudiante,
    findOneEstadoEstudiantePorDescripcion,
    findAllEstadoEstudiante,
    createEstadoEstudiante,
    updateEstadoEstudiante,
    destroyEstadoEstudiante
};