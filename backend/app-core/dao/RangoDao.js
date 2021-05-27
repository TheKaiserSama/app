const Models = require('../models/index');

const findByPkRango = id => {
    return Models.Rango.findByPk(id);
};

const findAllRango = () => {
    return Models.Rango.findAll({});
};

const createRango = rango => {
    return Models.Rango.create(rango);
};

const updateRango = (rango, id) => {
    return Models.Rango.update(rango, {
        where: { id: id },
        returning: true
    });
};

const destroyRango = id => {
    return Models.Rango.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkRango,
    findAllRango,
    createRango,
    updateRango,
    destroyRango
};