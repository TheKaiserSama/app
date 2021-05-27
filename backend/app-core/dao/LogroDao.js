const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index');
const { getCurrentYear } = require('../../app-api/helpers/date');

const includeModels = [
    {
        model: Models.PlanDocente,
        as: 'plan_docente',
        required: true,
        include: [
            {
                model: Models.Materia,
                as: 'materia',
                required: true
            },
            {
                model: Models.Periodo,
                as: 'periodo',
                required: true
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            },
            {
                model: Models.Docente,
                as: 'docente',
                required: true,
                include: [
                    {
                        model: Models.Persona,
                        as: 'persona',
                        required: true
                    }
                ]
            },
            {
                model: Models.Curso,
                as: 'curso',
                required: true,
                include: [
                    {
                        model: Models.Grado,
                        as: 'grado',
                        required: true
                    },
                    {
                        model: Models.Grupo,
                        as: 'grupo',
                        required: true
                    }
                ]
            }
        ]
    }
];

const findByPkLogro = (id, transaction = null) => {
    return Models.Logro.findByPk(id, {
        include: [
            ...includeModels,
            {
                model: Models.Actividad,
                as: 'actividad'
            }
        ],
        transaction: transaction
    });
};

const findAllLogroByPlanDocente = (id_plan_docente, order = [ ['id', 'DESC'] ], transaction = null) => {
    return Models.Logro.findAll({
        where: {
            id_plan_docente: id_plan_docente,
            // vigente: true
        },
        transaction: transaction,
        order: order
    });
};

const findAllLogro = (limit = 10, offset = 0, searchTerm = '', idPlanDocente, grado, periodo, anioLectivo = getCurrentYear()) => {
    const condicion = {
        '$plan_docente.anio_lectivo.anio_actual$': anioLectivo,
        descripcion: { [Op.iLike]: `%${ searchTerm }%` },
        vigente: true
    };
    if (grado) condicion['$plan_docente.curso.grado.grado$'] = grado;
    if (periodo) condicion['$plan_docente.periodo.numero$'] = periodo;
    if (idPlanDocente && idPlanDocente != '') condicion['id_plan_docente'] = idPlanDocente;

    return Models.Logro.findAndCountAll({
        where: condicion,
        include: includeModels,
        order: [
            ['id', 'ASC'],
            [ { model: Models.PlanDocente, as: 'plan_docente' }, { model: Models.Curso, as: 'curso' }, { model: Models.Grado, as: 'grado' }, 'grado', 'ASC' ],
            [ { model: Models.PlanDocente, as: 'plan_docente' }, { model: Models.Curso, as: 'curso' }, { model: Models.Grupo, as: 'grupo' }, 'descripcion', 'ASC' ],
            ['descripcion', 'ASC']
        ],
        limit: limit,
        offset: offset
    });
};

const createLogro = (logro, transaction = null) => {
    return Models.Logro.create(logro, {
        transaction: transaction
    });
};

const bulkCreateLogro = logros => {
    return Models.Logro.bulkCreate(logros, {
        validate: true,
        fields: ['descripcion', 'porcentaje', 'id_plan_docente']
    });
};

const updateLogro = (logro, id, transaction = null) => {
    return Models.Logro.update(logro, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyLogro = (id, transaction = null) => {
    return Models.Logro.destroy({
        where: { id: id },
        transaction: transaction
    });
};

const destroyLogroByPlanDocente = (id_plan_docente, transaction = null) => {
    return Models.Logro.update({ vigente: false }, {
        where: { id_plan_docente: id_plan_docente },
        returning: true,
        transaction: transaction
    });
};

const disableLogro = (id, transaction = null) => {
    return Models.Logro.update({ vigente: false }, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

////////////////////////////////////////
const findAll = (condition = {}, order = [], transaction = null) => {
    return Models.Logro.findAll({
        where: { ...condition },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};

module.exports = {
    findByPkLogro,
    findAllLogroByPlanDocente,
    findAllLogro,
    createLogro,
    bulkCreateLogro,
    updateLogro,
    disableLogro,
    destroyLogro,
    destroyLogroByPlanDocente,

    findAll,
};