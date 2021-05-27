const Models = require('../models/index');
const { sequelize, sequelize: { QueryTypes } } = require('../models/index');

const includeModels = [
    {
        model: Models.Actividad,
        as: 'actividad',
        required: true
    },
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true
    }
];

const findByPkEstudianteActividad = id => {
    return Models.EstudianteActividad.findByPk(id);
};

const findOneEstudianteActividad = (id_estudiante, id_actividad, transaction = null) => {
    return Models.EstudianteActividad.findOne({
        where: {
            id_estudiante: id_estudiante,
            id_actividad: id_actividad
        },
        transaction: transaction
    });
};

const findManyEstudianteActividad = (params = {}, order = [], transaction = null) => {
    return Models.EstudianteActividad.findAll({
        where: { ...params },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};

const findAllEstudianteActividad = (limit = 10, offset = 0, searchTerm = '') => {
    return Models.EstudianteActividad.findAndCountAll({
        include: [
            {
                model: Models.Estudiante,
                as: 'estudiante',
                required: true,
                include: [
                    {
                        model: Models.Persna,
                        as: 'persona',
                        required: true,
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
            },
            {
                model: Models.Actividad,
                as: 'actividad',
                required: true,
                include: [
                    {
                        model: Models.Logro,
                        as: 'logro',
                        required: true
                    }
                ]
            }
        ],
        limit: limit,
        offset: offset
    });
};

const findOrCreateEstudianteActividad = (estudianteActividad, transaction = null) => {
    return Models.EstudianteActividad.findOrCreate({
        where: {
            id_actividad: estudianteActividad.id_actividad,
            id_estudiante: estudianteActividad.id_estudiante
        },
        defaults: estudianteActividad,
        transaction: transaction
    });
};

const findNotaMaxima = (id_actividad, transaction = null) => {
    return sequelize.query(`
        SELECT id, id_actividad, id_estudiante, nota
        FROM "estudiante_actividad" WHERE id_actividad = ${ id_actividad } AND 
        nota = (SELECT MAX(nota) FROM "estudiante_actividad" WHERE id_actividad = ${ id_actividad });
    `, {
        type: QueryTypes.SELECT,
        transaction: transaction
    });
};

const findNotaMinima = (id_actividad, transaction = null) => {
    return sequelize.query(`
        SELECT id, id_actividad, id_estudiante, nota
        FROM "estudiante_actividad" WHERE id_actividad = ${ id_actividad } AND 
        nota = (SELECT MIN(nota) FROM "estudiante_actividad" WHERE id_actividad = ${ id_actividad });
    `, {
        type: QueryTypes.SELECT,
        transaction: transaction
    });
};

const findNotaPromedio = (id_actividad, transaction = null) => {
    return Models.EstudianteActividad.findAll({
        where: { id_actividad: id_actividad },
        attributes: [
            [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('nota')), '2'), 'promedio']
        ],
        transaction: transaction
    });
};

const createEstudianteActividad = (estudianteActividad, transaction = null) => {
    return Models.EstudianteActividad.create(estudianteActividad, {
        transaction: transaction
    });
};

const updateEstudianteActividad = (estudianteActividad, id, transaction = null) => {
    return Models.EstudianteActividad.update(estudianteActividad, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyEstudianteActividad = id => {
    return Models.EstudianteActividad.destroy({
        where: { id: id }
    });
};

//////////////////////////////////////////////
const findOne = (condition = {}, transaction = null) => {
    return Models.EstudianteActividad.findOne({
        where: { ...condition },
        include: includeModels,
        transaction: transaction
    });
};

module.exports = {
    findByPkEstudianteActividad,
    findOneEstudianteActividad,
    findManyEstudianteActividad,
    findAllEstudianteActividad,
    findOrCreateEstudianteActividad,
    findNotaMaxima,
    findNotaMinima,
    findNotaPromedio,
    createEstudianteActividad,
    updateEstudianteActividad,
    destroyEstudianteActividad,

    findOne
};