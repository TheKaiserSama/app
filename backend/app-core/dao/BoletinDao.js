const Models = require('../models/index');

const includeModels = [
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Models.Curso,
        as: 'curso',
        required: true
    },
    {
        model: Models.DirectorGrupo,
        as: 'director_grupo',
        required: true,
        include: [
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
        ]
    },
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
        model: Models.Periodo,
        as: 'periodo',
        required: false
    }
];

const findByPk = (id, transaction = null) => {
    return Models.Boletin.findByPk(id, {
        transaction: transaction,
        include: includeModels
    });
};

const findOne = (condition = {}, transaction = null) => {
    return Models.Boletin.findOne({
        where: { ...condition },
        include: includeModels,
        transaction: transaction
    });
};

const findAll = (condition = {}, order = [], transaction = null) => {
    return Models.Boletin.findAll({
        where: { ...condition },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};

const findOrCreate = (boletin, transaction = null) => {
    const { id_anio_lectivo, id_curso, id_director_grupo, id_estudiante, id_periodo = null } = boletin;
    return Models.Boletin.findOrCreate({
        where: {
            id_anio_lectivo,
            id_curso,
            id_director_grupo,
            id_estudiante,
            id_periodo
        },
        defaults: boletin,
        transaction: transaction
    });
};

const create = (boletin, transaction = null) => {
    return Models.Boletin.create(boletin, {
        returning: true,
        transaction: transaction
    });
};

const update = (boletin, condition = {}, transaction = null) => {
    return Models.Boletin.update(boletin, {
        where: { ...condition },
        returning: true,
        transaction: transaction
    });
};

const destroy = (condition = {}, transaction = null) => {
    return Models.Boletin.destroy({
        where: { ...condition },
        transaction: transaction
    });
};

module.exports = {
    findByPk,
    findOne,
    findAll,
    findOrCreate,
    create,
    update,
    destroy
};