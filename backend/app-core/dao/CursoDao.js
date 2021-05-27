const {
    sequelize, Sequelize: { Op }, Curso, Sede, 
    AnioLectivo, Jornada, Grado, Grupo 
} = require('../models/index');

const includeModels = [
    {
        model: Sede,
        as: 'sede',
        required: true
    },
    {
        model: AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Jornada,
        as: 'jornada',
        required: true
    },
    {
        model: Grado,
        as: 'grado',
        required: true
    },
    {
        model: Grupo,
        as: 'grupo',
        required: true
    }
];

const findByPkCurso = id => {
    return Curso.findByPk(id, {
        include: includeModels
    });
};

const findOneCursoUnique = (curso, transaction) => {
    const condicion = {
        id_anio_lectivo: curso.id_anio_lectivo,
        id_jornada: curso.id_jornada,
        '$grado.grado$': curso.grado.grado,
        '$grupo.descripcion$': curso.grupo.descripcion
    };
    if (curso.id) condicion.id = { [Op.ne]: curso.id };

    return Curso.findOne({
        where: condicion,
        include: includeModels,
        transaction: transaction
    });
};

const findAllCurso = (limit = 10, offset = 0, params = {}) => {
    const condicion = {};
    const { id_sede, id_anio_lectivo, id_grado, id_grupo } = params;
    if (id_sede) condicion.id_sede = id_sede;
    if (id_anio_lectivo) condicion.id_anio_lectivo = id_anio_lectivo;
    if (id_grado) condicion.id_grado = id_grado;
    if (id_grupo) condicion.id_grupo = id_grupo;

    return Curso.findAndCountAll({
        where: condicion,
        include: includeModels,
        order: [
            [ { model: AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC' ],
            [ { model: Grado, as: 'grado' }, 'grado', 'ASC' ],
            [ { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC' ]
        ],
        limit: limit,
        offset: offset
    });
};

const findGrupoByGrado = (id_sede, id_grado, id_anio_lectivo, transaction = null) => {
    const condicion = {
        id_anio_lectivo: id_anio_lectivo
    }
    if (id_sede) condicion.id_sede = id_sede;
    if (id_grado) condicion.id_grado = id_grado;

    return Curso.findAll({
        where: condicion,
        include: includeModels,
        order: [
            [{ model: Grupo, as: 'grupo' }, 'descripcion', 'ASC']
        ],
        transaction: transaction
    });
};

const findCurso = (curso, transaction = null) => {
    const { id_sede, id_anio_lectivo, id_grado } = curso;
    const condicion = {};
    if (id_sede) condicion.id_sede = id_sede;
    if (id_grado) condicion.id_grado = id_grado;
    if (id_anio_lectivo) condicion.id_anio_lectivo = id_anio_lectivo;

    return Curso.findAll({
        where: condicion,
        include: includeModels,
        transaction: transaction
    });
};

const findCursoPorSedeAnioLectivo = (params = {}, transaction = null) => {
    const { id_sede, id_anio_lectivo } = params;
    return Curso.findAll({
        where: {
            id_sede: id_sede,
            id_anio_lectivo: id_anio_lectivo
        },
        include: includeModels,
        order: [
            [ { model: Grado, as: 'grado' }, 'grado', 'ASC' ],
            [ { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC' ]
        ],
        transaction: transaction
    });
};

const findOrCreateCurso = (curso, transaction = null) => {
    return Curso.findOrCreate({
        where: {
            id_anio_lectivo: curso.id_anio_lectivo,
            id_jornada: curso.id_jornada,
            '$grado.grado$': curso.grado.grado,
            '$grupo.descripcion$': curso.grupo.descripcion
        },
        defaults: curso,
        include: includeModels,
        transaction: transaction
    });
};

const createCurso = (curso, transaction = null) => {
    return Curso.create(curso, { transaction: transaction });
};

const updateCurso = (curso, id, transaction = null) => {
    return Curso.update(curso, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyCurso = id => {
    return Curso.destroy({
        where: { id: id }
    });
};

const decrementCupoUtilizado = (id, transaction = null) => {
    return Curso.update(
        { cupo_utilizado: sequelize.literal('cupo_utilizado - 1') },
        {
            where: {
                id: id,
                cupo_utilizado: {
                    [Op.lt]: sequelize.col('cupo_maximo')
                }
            },
            transaction: transaction
        }
    );
};

const incrementCupoUtilizado = (id, transaction = null) => {
    return Curso.update(
        { cupo_utilizado: sequelize.literal('cupo_utilizado + 1') },
        {
            where: {
                id: id,
                cupo_utilizado: {
                    [Op.lt]: sequelize.col('cupo_maximo')
                }
            },
            transaction: transaction
        }
    );
};

const findGradoInCurso = id_grado => {
    return Curso.findOne({
        where: { id_grado: id_grado }
    });
};

const findGrupoInCurso = id_grupo => {
    return Curso.findOne({
        where: { id_grupo: id_grupo }
    });
};

/*********************************************/
const findAll = (condition = {}, order = [], transaction = null) => {
    return Curso.findAll({
        where: { ...condition },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};

module.exports = {
    findByPkCurso,
    findAllCurso,
    findOneCursoUnique,
    findGrupoByGrado,
    findCurso,
    findCursoPorSedeAnioLectivo,
    findOrCreateCurso,
    createCurso,
    updateCurso,
    destroyCurso,
    decrementCupoUtilizado,
    incrementCupoUtilizado,
    findGradoInCurso,
    findGrupoInCurso,

    findAll
};