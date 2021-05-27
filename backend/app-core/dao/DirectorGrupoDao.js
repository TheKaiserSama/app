const Models = require('../models/index');
const { sequelize, Sequelize: { Op } } = require('../models/index');

const includeModelsDirectorGrupo = [
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Models.Curso,
        as: 'curso',
        required: true,
        include: [
            {
                model: Models.Sede,
                as: 'sede',
                required: true
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            },
            {
                model: Models.Jornada,
                as: 'jornada',
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
            }
        ]
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
    }
];

const findByPkDirectorGrupo = (id, transaction = null) => {
    return Models.DirectorGrupo.findByPk(id, {
        include: includeModelsDirectorGrupo,
        transaction: transaction
    });
};

const findOneDirectorGrupo = (params = {}, order = [], transaction = null) => {
    return Models.DirectorGrupo.findOne({
        where: { ...params },
        include: includeModelsDirectorGrupo,
        order: order,
        transaction: transaction,
    });
};

const findManyDirectoresGrupo = (params = {}, order = [], transaction = null) => {
    return Models.DirectorGrupo.findAll({
        where: { ...params },
        include: includeModelsDirectorGrupo,
        order: order,
        transaction: transaction,
    });
};

const findAllDirectoresGrupo = (params = {}, order = [], transaction = null) => {
    const { id_sede, id_anio_lectivo, id_curso, search_term = '', limit = 10, offset = 0 } = params;
    const condicion = {
        '$docente.vigente$': true,
        [Op.or]: [
            {
                '$docente.persona.primer_nombre$': { [Op.iLike]: `%${ search_term }%` }
            },
            {
                '$docente.persona.primer_apellido$': { [Op.iLike]: `%${ search_term }%` }
            },
            {
                '$docente.persona.documento$': { [Op.iLike]: `%${ search_term }%` }
            }
        ]
    };
    if (id_sede) condicion['$curso.sede.id$'] = id_sede;
    if (id_anio_lectivo) condicion.id_anio_lectivo = id_anio_lectivo;
    if (id_curso) condicion.id_curso = id_curso;

    return Models.DirectorGrupo.findAndCountAll({
        where: condicion,
        include: includeModelsDirectorGrupo,
        order: order,
        limit: limit,
        offset: offset,
        transaction: transaction
    });
};

const createDirectorGrupo = (directorGrupo, transaction = null) => {
    return Models.DirectorGrupo.create(directorGrupo, {
        returning: true,
        transaction: transaction
    });
};

const updateDirectorGrupo = (directorGrupo, id) => {
    return Models.DirectorGrupo.update(directorGrupo, {
        where: { id: id },
        returning: true
    });
};

const destroyDirectorGrupo = id => {
    return Models.DirectorGrupo.destroy({
        where: { id: id }
    });
};

/**************************************** */
const findOne = (condition = {}, transaction = null) => {
    return Models.DirectorGrupo.findOne({
        where: { ...condition },
        include: includeModelsDirectorGrupo,
        transaction: transaction
    });
};

const findAll = (condition = {}, order = [], transaction = null) => {
    return Models.DirectorGrupo.findAll({
        where: { ...condition },
        include: includeModelsDirectorGrupo,
        order: order,
        transaction: transaction
    });
};

const findOrCreate = (directorGrupo, transaction = null) => {
    const { id_anio_lectivo, id_docente, id_curso } = directorGrupo;
    return Models.DirectorGrupo.findOrCreate({
        where: {
            id_anio_lectivo,
            id_docente,
            id_curso
        },
        defaults: directorGrupo,
        transaction: transaction
    });
};

module.exports = {
    findByPkDirectorGrupo,
    findOneDirectorGrupo,
    findManyDirectoresGrupo,
    findAllDirectoresGrupo,
    createDirectorGrupo,
    updateDirectorGrupo,
    destroyDirectorGrupo,

    findOne,
    findAll,
    findOrCreate
};