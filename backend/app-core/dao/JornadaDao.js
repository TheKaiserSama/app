const Models = require('../models/index');

const findByPkJornada = id => {
    return Models.Jornada.findByPk(id);
};

const findAllJornada = () => {
    return Models.Jornada.findAll({});
};

const createJornada = jornada => {
    return Models.Jornada.create(jornada);
};

const updateJornada = (jornada, id) => {
    return Models.Jornada.update(jornada, {
        where: { id: id },
        returning: true
    });
};

const destroyJornada = id => {
    return Models.Jornada.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkJornada,
    findAllJornada,
    createJornada,
    updateJornada,
    destroyJornada
};