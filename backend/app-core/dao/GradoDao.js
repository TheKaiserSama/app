const { Grado, sequelize } = require('../models/index');

const findByPkGrado = id => {
    return Grado.findByPk(id);
};

const findGradoPorDescripcion = (grado, transaction = null) => {
    return Grado.findOne({
        where: { grado: grado },
        transaction: transaction
    });
};

const findAllGrado = (params) => {
    const { vigente } = params;
    const condicion = {};
    if (vigente) condicion.vigente = vigente;

    return Grado.findAll({
        where: condicion,
        order: [ ['grado', 'ASC'] ]
    });
};

const findGradoPorAnio = (id_anio_lectivo) => {
    return sequelize.query(
        `
            SELECT g.id, g.grado FROM grado AS g INNER JOIN 
            (SELECT DISTINCT id_grado FROM curso WHERE id_anio_lectivo = ${ id_anio_lectivo }) AS c 
            ON c.id_grado = g.id ORDER BY g.grado;
        `,
        { type: sequelize.QueryTypes.SELECT }
    );
};

const findOrCreateGrado = grado => {
    return Grado.findOrCreate({
        where: { descripcion: grado.descripcion },
        defaults: grado
    });
};

const updateGrado = (grado, id) => {
    return Grado.update(grado, {
        where: { id: id },
        returning: true
    });
};

const destroyGrado = id => {
    return Grado.destroy({
        where: { id: id }
    });
};

const toggleGrado = grado => {
    return Grado.update({ vigente: grado.vigente }, {
        where: { id: grado.id },
        returning: true
    });
};

module.exports = {
    findByPkGrado,
    findGradoPorDescripcion,
    findAllGrado,
    findGradoPorAnio,
    findOrCreateGrado,
    updateGrado,
    destroyGrado,
    toggleGrado
};