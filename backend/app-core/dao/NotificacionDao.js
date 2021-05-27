const Models = require('../models/index');
const { sequelize, Sequelize: { Op } } = require('../models/index');

const includeModelsNotificacion = [
    {
        model: Models.TipoNotificacion,
        as: 'tipo_notificacion',
        required: true
    },
    {
        model: Models.Actividad,
        as: 'actividad',
        required: false
    },
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true,
        include: [
            {
                model: Models.EstadoEstudiante,
                as: 'estado_estudiante',
                required: true
            },
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

const findByPkNotificacion = id => {
    return Models.Notificacion.findByPk(id, {
        include: includeModelsNotificacion
    });
};

const findOneNotificacion = (params = {}, order = [], transaction = null) => {
    const condicion = {};
    const { mensaje, id_estudiante, id_plan_docente, fecha } = params;
    if (mensaje) condicion.mensaje = mensaje;
    if (id_estudiante) condicion.id_estudiante = id_estudiante;
    if (id_plan_docente) condicion.id_plan_docente = id_plan_docente;

    const arrayCondicion = [{ ...condicion }];
    if (fecha) {
        const sequelizeWhere = sequelize.where(
            sequelize.cast(sequelize.col('fecha'), 'date'),
            { [Op.eq]: fecha }
        );
        arrayCondicion.push(sequelizeWhere);
    };

    return Models.Notificacion.findOne({
        where: {
            [Op.and]: [ ...arrayCondicion ]
        },
        include: includeModelsNotificacion,
        order: order,
        transaction: transaction
    });
};

const findUltimasNotificaciones = (id_estudiante) => {
    return Models.Notificacion.findAll({
        where:{ id_estudiante: id_estudiante },
        include: includeModelsNotificacion,
        limit: 3,
        order: [ ['id', 'DESC'] ]
    });
};

const findAllNotificaciones = (params = {}, order = [], transaction = null) => {
    const { id_estudiante, id_docente, id_sede, id_anio_lectivo, id_grado, id_grupo, search_term = '', limit = 10, offset = 0 } = params;
    const condicion = {
        [Op.or]: [
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
    };
    if (id_estudiante) condicion.id_estudiante = id_estudiante;
    if (id_docente) condicion['$plan_docente.docente.id$'] = id_docente;
    if (id_sede) condicion['$plan_docente.sede.id$'] = id_sede;
    if (id_anio_lectivo) condicion['$plan_docente.anio_lectivo.id$'] = id_anio_lectivo;
    if (id_grado) condicion['$plan_docente.curso.grado.id$'] = id_grado;
    if (id_grupo) condicion['$plan_docente.curso.grupo.id$'] = id_grupo;

    return Models.Notificacion.findAndCountAll({
        where: condicion,
        include: includeModelsNotificacion,
        order: order,
        limit: limit,
        offset: offset,
        transaction: transaction
    });
};

const createNotificacion = notificacion => {
    return Models.Notificacion.create(notificacion);
};

const updateNotificacion = (notificacion, id) => {
    return Models.Notificacion.update(notificacion, {
        where: { id: id },
        returning: true
    });
};

const destroyNotificacion = id => {
    return Models.Notificacion.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkNotificacion,
    findOneNotificacion,
    findUltimasNotificaciones,
    findAllNotificaciones,
    createNotificacion,
    updateNotificacion,
    destroyNotificacion
};