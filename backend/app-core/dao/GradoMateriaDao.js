const { Sequelize: { Op }, AnioLectivo, Grado, Area, Materia, GradoMateria } = require('../models/index');

const includeModels = [
    {
        model: AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Grado,
        as: 'grado',
        required: true
    },
    {
        model: Materia,
        as: 'materia',
        required: true,
        include: [
            {
                model: Area,
                as: 'area',
                required: true
            }
        ]
    }
];

const findByPkGradoMateria = id => {
    return GradoMateria.findByPk(id, {
        include: includeModels
    });
};

const findGradoMateriaUnique = (gradoMateria, transaction = null) => {
    const condicion = {
        id_anio_lectivo: gradoMateria.id_anio_lectivo,
        id_grado: gradoMateria.id_grado,
        id_materia: gradoMateria.id_materia
    };
    if (gradoMateria.id) condicion.id = { [Op.ne]: gradoMateria.id };

    return GradoMateria.findOne({
       where: condicion,
       include: includeModels,
       transaction: transaction 
    });
};

const findGradoMateriaParams = (id_anio_lectivo, id_grado, transaction = null) => {
    return GradoMateria.findAll({
        where: {
            id_anio_lectivo: id_anio_lectivo,
            id_grado: id_grado
        },
        include: includeModels,
        transaction: transaction
    });
};

const findAllGradoMateria = (limit = 10, offset = 0, params = {}) => {
    const condicion = {};
    const { id_anio_lectivo, id_grado, search_term } = params;
    if (id_anio_lectivo) condicion.id_anio_lectivo = id_anio_lectivo;
    if (id_grado) condicion.id_grado = id_grado;
    if  (search_term) condicion[Op.or] = [
        {
            '$materia.area.nombre$': { [Op.iLike]: `%${ search_term }%` }
        },
        {
            '$materia.nombre$': { [Op.iLike]: `%${ search_term }%` }
        }
    ];

    return GradoMateria.findAndCountAll({
        where: condicion,
        include: includeModels,
        order: [
            [ { model: AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC' ],
            [ { model: Grado, as: 'grado' }, 'grado', 'ASC' ],
            [ { model: Materia, as: 'materia' }, { model: Area, as: 'area' }, 'nombre', 'ASC' ],
            [ { model: Materia, as: 'materia' }, 'nombre', 'ASC' ]
        ],
        limit: limit,
        offset: offset
    });
};

const findOrCreateGradoMateria = (gradoMateria, transaction = null) => {
    return GradoMateria.findOrCreate({
        where: {
            id_anio_lectivo: gradoMateria.id_anio_lectivo,
            id_grado: gradoMateria.id_grado,
            id_materia: gradoMateria.id_materia
        },
        defaults: gradoMateria,
        transaction: transaction
    });
};

const updateGradoMateria = (gradoMateria, id, transaction = null) => {
    return GradoMateria.update(gradoMateria, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyGradoMateria = id => {
    return GradoMateria.destroy({
        where: { id: id }
    });
};

//////////////////////////////////////////
const findAll = (condition = {}, order = [], transaction = null) => {
    return GradoMateria.findAll({
        where: { ...condition },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};

module.exports = {
    findByPkGradoMateria,
    findGradoMateriaUnique,
    findGradoMateriaParams,
    findAllGradoMateria,
    findOrCreateGradoMateria,
    updateGradoMateria,
    destroyGradoMateria,

    findAll,
};