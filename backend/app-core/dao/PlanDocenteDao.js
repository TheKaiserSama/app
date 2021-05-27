const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index');
const { getCurrentDate } = require('../../app-api/helpers/date');

const includeModelsPlanDocente = [
    {
        model: Models.Periodo,
        as: 'periodo',
        required: true
    },
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo'
    },
    {
        model: Models.Sede,
        as: 'sede',
        required: true
    },
    {
        model: Models.Docente,
        as: 'docente',
        required: true
    },
    {
        model: Models.Materia,
        as: 'materia',
        required: true,
        include: [
            {
                model: Models.Area,
                as: 'area',
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
            },
            {
                model: Models.Jornada,
                as: 'jornada',
                required: true
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            }
        ]
    }
];

const findByPkPlanDocente = (id, transaction = null) => {
    return Models.PlanDocente.findByPk(id, {
        include: includeModelsPlanDocente,
        transaction: transaction
    });
};

const findOne = (condition = {}, transaction = null) => {
    return Models.PlanDocente.findOne({
        where: { ...condition },
        include: includeModelsPlanDocente,
        transaction: transaction
    });
};

const findAllPlanDocente = (limit = 10, offset = 0, searchTerm = '', idDocente, currentAnioLectivo = getCurrentYear()) => {
    return Models.PlanDocente.findAndCountAll({
        where: {
            // vigente: true,
            id_docente: idDocente,
            '$anio_lectivo.anio_actual$': currentAnioLectivo,
            [Op.or]: [
                { '$materia.nombre$': { [Op.iLike]: `%${ searchTerm }%` } },
                { '$materia.area.nombre$': { [Op.iLike]: `%${ searchTerm }%` } }
            ]
        },
        include: includeModelsPlanDocente,
        order: [
            [ { model: Models.Materia, as: 'materia' }, { model: Models.Area, as: 'area' }, 'nombre', 'ASC' ],
            [ { model: Models.Materia, as: 'materia' }, 'nombre', 'ASC' ],
            [ { model: Models.Curso, as: 'curso' }, { model: Models.Grado, as: 'grado' }, 'grado', 'ASC' ],
            [ { model: Models.Curso, as: 'curso' }, { model: Models.Grupo, as: 'grupo' }, 'descripcion', 'ASC' ],
            [ { model: Models.AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC' ],
            [ { model: Models.Periodo, as: 'periodo' }, 'numero', 'ASC' ]
        ],
        limit: limit,
        offset: offset
    });
};

const findPlanDocenteParametrosOpcionales = (params = {}, order = [], transaction = null) => {
    const currentDate = getCurrentDate();
    const condicion = {
        // '$periodo.fecha_inicio$': {
        //     [Op.lte]: currentDate
        // },
        // '$periodo.fecha_finalizacion$': {
        //     [Op.gte]: currentDate
        // }
    };
    const { id_curso, id_materia, id_docente, id_anio_lectivo, fecha_inicio, fecha_finalizacion } = params;
    if (id_curso) condicion.id_curso = id_curso;
    if (id_materia) condicion.id_materia = id_materia;
    if (id_docente) condicion.id_docente = id_docente;
    if (id_anio_lectivo) condicion.id_anio_lectivo = id_anio_lectivo;
    if (fecha_inicio) condicion['$periodo.fecha_inicio$'] = { [Op.lte]: currentDate };
    if (fecha_finalizacion) condicion['$periodo.fecha_finalizacion$'] = { [Op.gte]: currentDate };

    return Models.PlanDocente.findAll({
        where: condicion,
        include: includeModelsPlanDocente,
        order: order,
        transaction: transaction
    });
};

const findPlanDocentePorCurso = (id_curso, id_anio_lectivo, transaction = null) => {
    return Models.PlanDocente.findAll({
        where: {
            id_anio_lectivo: id_anio_lectivo,
            id_curso: id_curso
        },
        include: includeModelsPlanDocente,
        transaction: transaction
    });
};

const findManyPlanDocente = (params = {}, order = [], transaction = null) => {
    return Models.PlanDocente.findAll({
        where: { ...params },
        include: includeModelsPlanDocente,
        order: order,
        transaction: transaction
    });
};

const findOrCreatePlanDocente = (planDocente, transaction = null) => {
    return Models.PlanDocente.findOrCreate({
        where: {
            id_curso: planDocente.id_curso,
            id_materia: planDocente.id_materia,
            id_periodo: planDocente.id_periodo,
            id_anio_lectivo: planDocente.id_anio_lectivo
        },
        defaults: planDocente,
        transaction: transaction
    });
};

const createPlanDocente = planDocente => {
    return Models.PlanDocente.create(planDocente);
};

const updatePlanDocente = (planDocente, id, transaction = null) => {
    return Models.PlanDocente.update(planDocente, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyPlanDocente = (id, transaction = null) => {
    return Models.PlanDocente.destroy({
        where: { id: id },
        transaction: transaction
    });
};

const findMateriaInPlanDocente = id_materia => {
    return Models.PlanDocente.findOne({
        where: { id_materia: id_materia }
    });
};

const findCursoInPlanDocente = id_curso => {
    return Models.PlanDocente.findOne({
        where: { id_curso: id_curso }
    });
};

module.exports = {
    findOne,
    findByPkPlanDocente,
    findAllPlanDocente,
    findPlanDocenteParametrosOpcionales,
    findPlanDocentePorCurso,
    findManyPlanDocente,
    findOrCreatePlanDocente,
    createPlanDocente,
    updatePlanDocente,
    destroyPlanDocente,
    findMateriaInPlanDocente,
    findCursoInPlanDocente
};