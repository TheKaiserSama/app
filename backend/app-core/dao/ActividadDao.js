const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index');

const includeModels = [
    {
        model: Models.Logro,
        as: 'logro',
        required: true
    }
];

const findByPkActividad = id => {
    return Models.Actividad.findByPk(id, {
        include: [
            {
                model: Models.Logro,
                as: 'logro',
                required: true
            }
        ]
    });
};

const findAllActividad = (limit = 10, offset = 0, searchTerm = '', idLogro) => {
    return Models.Actividad.findAndCountAll({
        where: {
            id_logro: idLogro,
            [Op.or]: [
                {
                    nombre: { [Op.iLike]: `%${ searchTerm }%` },
                    descripcion: { [Op.iLike]: `%${ searchTerm }%` },
                }
            ]
        },
        include: [
            {
                model: Models.Logro,
                as: 'logro',
                required: true
            }
        ],
        order: [ ['nombre', 'ASC'], ['descripcion', 'ASC'] ],
        limit: limit,
        offset: offset
    });
};

const findAllActividadByLogro = (id_logro, transaction = null) => {
    return Models.Actividad.findAll({
        where: { id_logro: id_logro },
        transaction: transaction,
        order: [ ['nombre', 'ASC'], ['descripcion', 'ASC'] ]
    });
};

const createActividad = (actividad, transaction = null) => {
    return Models.Actividad.create(actividad, {
        transaction: transaction
    });
};

const bulkCreateActividad = actividades => {
    return Models.Actividad.bulkCreate(actividades, {
        validate: true,
        fields: ['nombre', 'descripcion', 'porcentaje', 'id_logro']
    });
};

const findOrCreateActividad = (actividad, transaction = null) => {
    return Models.Actividad.findOrCreate({
        where: { nombre: actividad.nombre },
        defaults: actividad,
        transaction: transaction
    });
};

const updateActividad = (actividad, id, transaction = null) => {
    return Models.Actividad.update(actividad, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyActividad = (id, transaction = null) => {
    return Models.Actividad.destroy({
        where: { id: id },
        transaction: transaction
    });
};

const destroyActividadByLogro = (id_logro, transaction = null) => {
    return Models.Actividad.destroy({
        where: { id_logro: id_logro },
        transaction: transaction
    });
};

///////////////////////////////////////////
const findAll = (condition = {}, order = [], transaction = null) => {
    return Models.Actividad.findAll({
        where: { ...condition },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};


module.exports = {
    findByPkActividad,
    findAllActividad,
    findAllActividadByLogro,
    findOrCreateActividad,
    createActividad,
    bulkCreateActividad,
    updateActividad,
    destroyActividad,
    destroyActividadByLogro,

    findAll,
};