const Models = require('../models/index');

const findByPkEstudianteLogro = id => {
    return Models.EstudianteLogro.findByPk(id);
};

const findOneEstudianteLogro = (id_estudiante, id_logro, transaction = null) => {
    return Models.EstudianteLogro.findOne({
        where: {
            id_estudiante: id_estudiante,
            id_logro: id_logro
        },
        transaction: transaction
    });
};

const findAllEstudianteLogro = () => {
    return Models.EstudianteLogro.findAll({});
};

const findOrCreateEstudianteLogro = (estudianteLogro, transaction = null) => {
    return Models.EstudianteLogro.findOrCreate({
        where: {
            id_logro: estudianteLogro.id_logro,
            id_estudiante: estudianteLogro.id_estudiante
        },
        defaults: estudianteLogro,
        transaction: transaction
    });
};

const createEstudianteLogro = estudianteLogro => {
    return Models.EstudianteLogro.create(estudianteLogro);
};

const updateEstudianteLogro = (estudianteLogro, id, transaction = null) => {
    return Models.EstudianteLogro.update(estudianteLogro, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyEstudianteLogro = id => {
    return Models.EstudianteLogro.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkEstudianteLogro,
    findOneEstudianteLogro,
    findAllEstudianteLogro,
    findOrCreateEstudianteLogro,
    createEstudianteLogro,
    updateEstudianteLogro,
    destroyEstudianteLogro
};