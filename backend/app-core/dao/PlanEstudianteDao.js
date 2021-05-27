const Models = require('../models/index');

const includeModelsPlanEstudiante = [
    {
        model: Models.PlanDocente,
        as: 'plan_docente',
        required: true
    },
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true
    }
];

const findByPkPlanEstudiante = id => {
    return Models.PlanEstudiante.findByPk(id);
};

const findAllPlanEstudiante = (limit = 10, offset = 0, searchTerm = '') => {
    return Models.PlanEstudiante.findAndCountAll({
        include: [
            {
                model: Models.Estudiante,
                as: 'estudiante',
                required: true,
                include: [
                    {
                        model: Models.Persna,
                        as: 'persona',
                        where: {
                            [Op.or]: [
                                {
                                    primer_nombre: {
                                        [Op.iLike]: `%${ searchTerm }%`
                                    }
                                },
                                {
                                    primer_apellido: {
                                        [Op.iLike]: `%${ searchTerm }%`
                                    }
                                },
                                {
                                    documento: {
                                        [Op.iLike]: `%${ searchTerm }%`
                                    }
                                }
                            ]
                        },
                    }
                ]
            }
        ],
        limit: limit,
        offset: offset
    });
};

const findPlanEstudiantePorPlanDocente = id_plan_docente => {
    return Models.PlanEstudiante.findAll({
        where: { id_plan_docente: id_plan_docente }
    });
};

const findPlanEstudiantePorEstudiante = (params) => {
    const { id_estudiante, id_periodo, id_anio_lectivo, id_materia } = params;
    const condicion = {};
    if (id_estudiante) condicion.id_estudiante = id_estudiante;
    if (id_periodo) condicion['$plan_docente.id_periodo$'] = id_periodo;
    if (id_anio_lectivo) condicion['$plan_docente.id_anio_lectivo$'] = id_anio_lectivo;
    if (id_materia) condicion['$plan_docente.id_materia$'] = id_materia;

    return Models.PlanEstudiante.findOne({
        where: condicion,
        include: [
            {
                model: Models.PlanDocente,
                as: 'plan_docente',
                required: true,
                include: [
                    {
                        model: Models.Materia,
                        as: 'materia',
                        required: true
                    }
                ]
            }
        ]
    });
};

const findPlanEstudiantePorEstudianteAnioLectivo = (id_estudiante, id_anio_lectivo, transaction = null) => {
    return Models.PlanEstudiante.findAll({
        where: {
            id_estudiante: id_estudiante,
            '$plan_docente.id_anio_lectivo$': id_anio_lectivo
        },
        include: includeModelsPlanEstudiante,
        transaction: transaction
    });
};

const findOrCreatePlanEstudiante = (planEstudiante, transaction = null) => {
    return Models.PlanEstudiante.findOrCreate({
        where: {
            id_plan_docente: planEstudiante.id_plan_docente,
            id_estudiante: planEstudiante.id_estudiante
        },
        defaults: planEstudiante,
        transaction: transaction
    });
};

const createPlanEstudiante = (planEstudiante, transaction = null) => {
    return Models.PlanEstudiante.create(planEstudiante, {
        transaction: transaction
    });
};

const updatePlanEstudiante = (planEstudiante, id) => {
    return Models.PlanEstudiante.update(planEstudiante, {
        where: { id: id },
        returning: true
    });
};

const destroyPlanEstudiante = (id, transaction = null) => {
    return Models.PlanEstudiante.destroy({
        where: { id: id },
        transaction: transaction
    });
};

module.exports = {
    findByPkPlanEstudiante,
    findAllPlanEstudiante,
    findPlanEstudiantePorPlanDocente,
    findPlanEstudiantePorEstudiante,
    findPlanEstudiantePorEstudianteAnioLectivo,
    findOrCreatePlanEstudiante,
    createPlanEstudiante,
    updatePlanEstudiante,
    destroyPlanEstudiante
};