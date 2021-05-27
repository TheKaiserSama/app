const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index');
const { getCurrentYear } = require('../../app-api/helpers/date');

const includeModelsMatricula = [
    {
        model: Models.EstadoMatricula,
        as: 'estado_matricula',
        required: true
    },
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
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
                required: true,
                include: [
                    {
                        model: Models.Municipio,
                        as: 'municipio',
                        required: true,
                        include: [
                            {
                                model: Models.Departamento,
                                as: 'departamento',
                                required: true
                            }
                        ]
                    },
                    {
                        model: Models.Sexo,
                        as: 'sexo',
                        required: true
                    },
                    {
                        model: Models.Rol,
                        as: 'rol',
                        required: true
                    },
                    {
                        model: Models.TipoDocumento,
                        as: 'tipo_documento',
                        required: true
                    }
                ]
            }
        ]
    },
    {
        model: Models.Curso,
        as: 'curso',
        required: true,
        include: [
            {
                model: Models.Jornada,
                as: 'jornada',
                required: true
            },
            {
                model: Models.Sede,
                as: 'sede',
                required: true
            },
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
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            }
        ]
    }
];

const findByPkMatricula = id => {
    return Models.Matricula.findByPk(id, {
        include: includeModelsMatricula
    });
};

const findMatriculaPorEstudiante = id_estudiante => {
    return Models.Matricula.findAll({
        where: {
            id_estudiante: id_estudiante,
            vigente: true
        },
        include: includeModelsMatricula
    });
};

const findAllMatricula = (limit = 10, offset = 0, search_term = '', id_grado, id_grupo, anio_lectivo = getCurrentYear(), vigente) => {
    const condicion = {
        vigente: vigente,
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
        ],
        '$anio_lectivo.anio_actual$': anio_lectivo
    };
    if (id_grado && id_grado != '') condicion['$curso.grado.id$'] = id_grado;
    if (id_grupo) condicion['$curso.grupo.id$'] = id_grupo;

    return Models.Matricula.findAndCountAll({
        where: condicion,
        include: includeModelsMatricula,
        order: [
            ['id', 'DESC']
            // [ { model: Models.Estudiante, as: 'estudiante' }, { model: Models.Persona, as: 'persona' }, 'primer_nombre', 'ASC' ],
            // [ { model: Models.Estudiante, as: 'estudiante' }, { model: Models.Persona, as: 'persona' }, 'primer_apellido', 'ASC' ]
        ],
        limit: limit,
        offset: offset
    });
};

const findAllMatriculaByCurso = (curso, transaction = null) => {
    return Models.Matricula.findAll({
        where: {
            vigente: true,
            '$curso.id_anio_lectivo$': curso.id_anio_lectivo,
            '$curso.id_jornada$': curso.id_jornada,
            '$curso.grado.grado$': curso.grado.grado,
            '$curso.grupo.descripcion$': curso.grupo.descripcion,
            '$estudiante.vigente$': true
        },
        include: includeModelsMatricula,
        transaction: transaction
    });
};

const findMatriculaByIdCurso = (id, transaction = null) => {
    return Models.Matricula.findAll({
        where: { id_curso: id },
        include: includeModelsMatricula,
        transaction: transaction
    });
};

const findOrCreateMatricula = (matricula, transaction = null) => {
    return Models.Matricula.findOrCreate({
        where: {
            id_estudiante: matricula.id_estudiante,
            id_anio_lectivo: matricula.id_anio_lectivo
        },
        defaults: matricula,
        transaction: transaction
    });
};

const createMatricula = (matricula, transaction = null) => {
    return Models.Matricula.create(matricula, { transaction: transaction });
};

const updateMatricula = (matricula, id, transaction = null) => {
    return Models.Matricula.update(matricula, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyMatricula = id => {
    return Models.Matricula.destroy({
        where: { id: id }
    });
};

const disableMatricula = id => {
    return Models.Matricula.update({ vigente: false }, {
        where: { id: id },
        returning: true
    });
};

module.exports = {
    findByPkMatricula,
    findMatriculaPorEstudiante,
    findAllMatricula,
    findAllMatriculaByCurso,
    findMatriculaByIdCurso,
    findOrCreateMatricula,
    createMatricula,
    updateMatricula,
    disableMatricula,
    destroyMatricula
};