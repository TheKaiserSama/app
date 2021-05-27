const { Grupo, Sequelize: { Op } } = require('../models/index');

const findByPkGrupo = id => {
    return Grupo.findByPk(id);
};

const findGrupoPorDescripcion = (grupo, transaction = null) => {
    const condicion = {};
    const { id, descripcion } = grupo;

    if (id) condicion.id = { [Op.ne]: id };
    if (descripcion) condicion.descripcion = descripcion;

    return Grupo.findOne({
        where: condicion,
        transaction: transaction
    });
};

const findAllGrupo = (params) => {
    const { vigente } = params;
    const condicion = {};
    if (vigente) condicion.vigente = vigente;

    return Grupo.findAll({
        where: condicion,
        order: [ ['descripcion', 'ASC'] ]
    });
};

const findOrCreateGrupo = grupo => {
    return Grupo.findOrCreate({
        where: { descripcion: grupo.descripcion },
        defaults: grupo
    });
};

const updateGrupo = (grupo, id) => {
    return Grupo.update(grupo, {
        where: { id: id },
        returning: true
    });
};

const destroyGrupo = id => {
    return Grupo.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkGrupo,
    findGrupoPorDescripcion,
    findAllGrupo,
    findOrCreateGrupo,
    updateGrupo,
    destroyGrupo
};