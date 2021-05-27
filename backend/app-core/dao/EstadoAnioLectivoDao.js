const Models = require('../models/index');

const findByPkEstadoAnioLectivo = id => {
    return Models.EstadoAnioLectivo.findByPk(id);
};

const findAllEstadoAnioLectivo = () => {
    return Models.EstadoAnioLectivo.findAll({});
};

const createEstadoAnioLectivo = estadoAnioLectivo => {
    return Models.EstadoAnioLectivo.create(estadoAnioLectivo);
};

const updateEstadoAnioLectivo = (estadoAnioLectivo, id) => {
    return Models.EstadoAnioLectivo.update(estadoAnioLectivo, {
        where: { id: id },
        returning: true
    });
};

const destroyEstadoAnioLectivo = id => {
    return Models.EstadoAnioLectivo.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkEstadoAnioLectivo,
    findAllEstadoAnioLectivo,
    createEstadoAnioLectivo,
    updateEstadoAnioLectivo,
    destroyEstadoAnioLectivo
};