const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index')

const includeModels = [
    {
        model: Models.EstadoAnioLectivo,
        as: 'estado_anio_lectivo',
        required: true
    },
    {
        model: Models.Rango,
        as: 'rango',
        required: true
    }
];

const findByPkAnioLectivo = (id, transaction = null) => {
    return Models.AnioLectivo.findByPk(id, {
        include: [
            ...includeModels,
            {
                model: Models.Periodo,
                as: 'periodo'
            }
        ],
        transaction: transaction
    });
};

const findOneAnioLectivoUnique = anioLectivo => {
    const condicion = {
        anio_actual: anioLectivo.anio_actual
    };
    if (anioLectivo && anioLectivo.id) condicion.id = { [Op.ne]: anioLectivo.id };

    return Models.AnioLectivo.findOne({
        where: condicion
    });
};

const findOneAnioLectivoByAnio = (anio, transaction = null) => {
    return Models.AnioLectivo.findOne({
        where: { anio_actual: anio },
        include: [
            ...includeModels,
            {
                model: Models.Periodo,
                as: 'periodo'
            }
        ],
        transaction: transaction
    });
};

const findAllAnioLectivo = (params = {}) => {
    const { vigente } = params;
    const condicion = {};
    if (vigente) condicion.vigente = vigente;

    return Models.AnioLectivo.findAll({
        where: condicion,
        include: includeModels,
        order: [ ['anio_actual', 'DESC'] ]
    });
};

const findOrCreateAnioLectivo = anioLectivo => {
    return Models.AnioLectivo.findOrCreate({
        where: { anio_actual: anioLectivo.anio_actual },
        defaults: anioLectivo
    });
};

const createAnioLectivo = (anioLectivo, transaction = null) => {
    return Models.AnioLectivo.create(anioLectivo, { transaction: transaction });
};

const updateAnioLectivo = (anioLectivo, id, transaction = null) => {
    return Models.AnioLectivo.update(anioLectivo, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyAnioLectivo = (id, transaction = null) => {
    return Models.AnioLectivo.destroy({
        where: { id: id },
        transaction: transaction
    });
};


/////////////////////////////////////////////
const findOne = (condition = {}, transaction = null) => {
    return Models.AnioLectivo.findOne({
        where: { ...condition },
        include: includeModels,
        transaction: transaction
    });
};

module.exports = {
    findByPkAnioLectivo,
    findOneAnioLectivoUnique,
    findOneAnioLectivoByAnio,
    findAllAnioLectivo,
    findOrCreateAnioLectivo,
    createAnioLectivo,
    updateAnioLectivo,
    destroyAnioLectivo,

    findOne
};