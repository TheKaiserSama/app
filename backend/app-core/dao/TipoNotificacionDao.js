const Models = require('../models/index');

const findOneTipoNotificacion = id => {
    return Models.TipoNotificacion.findOne({
        where: { id: id }
    });
}

const findAllTipoNotificacion = () => {
    return Models.TipoNotificacion.findAll({});
}

module.exports = {
    findOneTipoNotificacion,
    findAllTipoNotificacion
}