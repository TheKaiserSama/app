const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index');

const includeModelsSede = [
    {
        model: Models.Institucion,
        as: 'institucion'
    }
];

const findByPkSede = id => {
    return Models.Sede.findByPk(id, {
        include: includeModelsSede
    });
};

const findSedePorNombre = (nombre, transaction = null) => {
    return Models.Sede.findOne({
        where: { nombre: nombre },
        transaction: transaction
    });
};

const findSedeUnique = (sede, transaction = null) => {
    const { id, nombre } = sede;
    const condicion = {};
    if (nombre) condicion.nombre = nombre;
    if (sede && id) condicion.id = { [Op.ne]: sede.id };
    // const condicion = { nombre: sede.nombre };
    // if (sede && sede.id) condicion.id = { [Op.ne]: sede.id };

    return Models.Sede.findOne({
        where: condicion,
        transaction: transaction
    });
};

const findAllSede = () => {
    return Models.Sede.findAll({
        include: includeModelsSede
    });
};

const findOrCreateSede = sede => {
    return Models.Sede.findOrCreate({
        where: { nombre: sede.nombre },
        defaults: sede
    });
};

const createSede = sede => {
    return Models.Sede.create(sede);
};

const updateSede = (sede, id) => {
    return Models.Sede.update(sede, {
        where: { id: id },
        returning: true
    });
};

const destroySede = id => {
    return Models.Sede.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkSede,
    findSedePorNombre,
    findSedeUnique,
    findAllSede,
    findOrCreateSede,
    createSede,
    updateSede,
    destroySede
};