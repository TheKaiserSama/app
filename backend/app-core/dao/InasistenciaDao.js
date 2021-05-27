const Models = require('../models/index');
const { sequelize, Sequelize: { Op } } = require('../models/index');
const { formatDate } = require('../../app-api/helpers/date');

const includeModelsInasistencia = [
    {
        model: Models.Estudiante,
        as: 'estudiante',
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
        model: Models.PlanDocente,
        as: 'plan_docente',
        required: true,
        include: [
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
                    }
                ]
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
                model: Models.Sede,
                as: 'sede',
                required: true
            }
        ]
    }
];

const findByPkInasistencia = id => {
    return Models.Inasistencia.findByPk(id, {
        include: includeModelsInasistencia
    });
};

const findOneInasistencia = (params = {}, order = [], transaction = null) => {
    const condicion = {};
    /* Extraer parametros de consulta */

    return Models.Inasistencia.findOne({
        where: condicion,
        include: includeModelsInasistencia,
        order: order,
        transaction: transaction
    });
};

const findManyInasistencia = (params = {}, order = [], transaction = null) => {
    return Models.Inasistencia.findAll({
        where: { ...params },
        include: includeModelsInasistencia,
        order: order,
        transaction: transaction
    });
};

const findAllInasistencia = (params = {}, order = [], transaction = null) => {
    const { id_plan_docente, id_estudiante, id_docente, id_sede, id_anio_lectivo, id_curso, id_materia, search_term = '', limit = 10, offset = 0 } = params;
    const condicion = {};

    if (id_docente) {
        condicion[Op.or] = [
            {
                '$estudiante.persona.primer_nombre$': { [Op.iLike]: `%${ search_term }%` }
            },
            {
                '$estudiante.persona.primer_apellido$': { [Op.iLike]: `%${ search_term }%` }
            },
            {
                '$estudiante.persona.documento$': { [Op.iLike]: `%${ search_term }%` }
            }
        ]
    }

    if (id_plan_docente) condicion.id_plan_docente = id_plan_docente;
    if (id_estudiante) condicion['$estudiante.id$'] = id_estudiante;
    if (id_docente) condicion['$plan_docente.docente.id$'] = id_docente;
    if (id_sede) condicion['$plan_docente.sede.id$'] = id_sede;
    if (id_anio_lectivo) condicion['$plan_docente.anio_lectivo.id$'] = id_anio_lectivo;
    if (id_curso) condicion['$plan_docente.curso.id$'] = id_curso;
    if (id_materia) condicion['$plan_docente.materia.id$'] = id_materia;

    return Models.Inasistencia.findAndCountAll({
        where: condicion,
        include: includeModelsInasistencia,
        order: order,
        limit: limit,
        offset: offset,
        transaction: transaction
    });
};

const findInasistenciaByParams = (params = {}, order = [], transaction = null) => {    
    const condicion = {};
    for (const property in params) {
        if (params[property]) {
            condicion[property] = params[property];
        }
    }
    delete condicion.fecha;
    
    const arrayCondicion = [{ ...condicion }];
    if (params.fecha) {
        const sequelizeWhere = sequelize.where(
            sequelize.cast(sequelize.col('fecha'), 'date'), { [Op.eq]: params.fecha }
        );
        arrayCondicion.push(sequelizeWhere);
    }

    return Models.Inasistencia.findAll({
        where: {
            [Op.and]: [ ...arrayCondicion ]
        },
        include: includeModelsInasistencia,
        order: order,
        transaction: transaction
    });
};

const findOrCreateInasistencia = (inasistencia, transaction = null) => {
    let { fecha, justificado, id_estudiante, id_plan_docente } = inasistencia;
    const onlyDate = fecha.split(' ')[0];
    const condicion = {
        [Op.and]: [
            {
                id_estudiante: id_estudiante,
                id_plan_docente: id_plan_docente
            },
            sequelize.where(
                sequelize.cast(sequelize.col('fecha'), 'date'), { [Op.eq]: onlyDate }
            )
        ]
    };
    return Models.Inasistencia.findOrCreate({
        where: condicion,
        defaults: { fecha: onlyDate, justificado, id_estudiante, id_plan_docente },
        transaction: transaction
    });
};

const createInasistencia = inasistencia => {
    return Models.Inasistencia.create(inasistencia);
};

const bulkCreateInasistencias = inasistencias => {
    return Models.Inasistencia.bulkCreate(inasistencias, {
        updateOnDuplicate: ['vigente', 'fecha', 'justificado', 'id_estudiante', 'id_plan_docente']
    });
};

const updateInasistencia = (inasistencia, id, transaction = null) => {
    return Models.Inasistencia.update(inasistencia, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyInasistencia = (condicion = {}, transaction = null) => {
    return Models.Inasistencia.destroy({
        where: condicion,
        transaction: transaction
    });
};

const count = (condition = {}, transaction = null) => {
    return Models.Inasistencia.count({
        where: { ...condition },
        transaction: transaction
    });
};

module.exports = {
    findByPkInasistencia,
    findOneInasistencia,
    findManyInasistencia,
    findAllInasistencia,
    findInasistenciaByParams,
    findOrCreateInasistencia,
    createInasistencia,
    bulkCreateInasistencias,
    updateInasistencia,
    destroyInasistencia,

    count,
};