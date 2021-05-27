const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index');

const includeModels = [
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    }
];

const findByPkPeriodo = (id, transaction = null) => {
    return Models.Periodo.findByPk(id, {
        transaction: transaction
    });
};

const findPeriodosByAnioLectivo = (id_anio_lectivo, numero) => {
    const condicion = {
        id_anio_lectivo: id_anio_lectivo
    };
    if (numero) condicion.numero = numero;

    return Models.Periodo.findAll({
        where: condicion
    });
};

const findPeriodoUnique = (periodo, transaction = null) => {
    const condicion = {
        numero: periodo.numero,
        id_anio_lectivo: periodo.id_anio_lectivo
    };
    if (periodo && periodo.id) condicion.id = { [Op.ne]: periodo.id };

    return Models.Periodo.findOne({
        where: condicion,
        transaction: transaction
    });
};

const findAllPeriodo = (limit = 10, offset = 0, numeroAnioLectivo) => {
    const condicion = {};
    if (numeroAnioLectivo) condicion['$anio_lectivo.anio_actual$'] = numeroAnioLectivo;

    return Models.Periodo.findAndCountAll({
        where: condicion,
        include: [
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo'
            }
        ],
        limit: limit,
        offset: offset,
        order: [
            [ { model: Models.AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC' ],
            [ 'numero', 'ASC' ]
        ]
    });
};

const findOrCreatePeriodo = periodo => {
    return Models.Periodo.findOrCreate({
        where: {
            numero: periodo.numero,
            id_anio_lectivo: periodo.id_anio_lectivo
        },
        defaults: periodo
    });
};

const createPeriodo = periodo => {
    return Models.Periodo.create(periodo);
};

const updatePeriodo = (periodo, id) => {
    return Models.Periodo.update(periodo, {
        where: { id: id },
        returning: true
    });
};

const destroyPeriodo = id => {
    return Models.Periodo.destroy({
        where: { id: id }
    });
};

////////////////////////////////////////
const findAll = (condition = {}, order = [], transaction = null) => {
    return Models.Periodo.findAll({
        where: { ...condition },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};

module.exports = {
    findByPkPeriodo,
    findPeriodosByAnioLectivo,
    findAllPeriodo,
    findPeriodoUnique,
    findOrCreatePeriodo,
    createPeriodo,
    updatePeriodo,
    destroyPeriodo,

    findAll,
};