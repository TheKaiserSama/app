const Models = require('../models/index');
const { sequelize, Sequelize: { Op } } = require('../models/index');
const { getCurrentYear } = require('../../app-api/helpers/date');

const includeModelsPersona = [
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
    },
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
    }
];

const findByPkPersona = id => {
    return Models.Persona.findByPk(id, {
        include: includeModelsPersona
    });
};

const findEstudianteIsMatriculado = documento => {
    return Models.Matricula.findOne({
        where: {
            '$estudiante.persona.documento$': documento,
            '$anio_lectivo.anio_actual$': getCurrentYear()
        },
        include: [
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
                        model: Models.Persona,
                        as: 'persona',
                        required: true
                    }
                ]
            }
        ]
    })
};

const findPersonaPorDocumento = (documento, params = {}) => {
    const condicion = {
        documento: documento
    };
    const { id } = params;
    if (id) condicion.id = { [Op.ne]: id };

    return Models.Persona.findOne({
        where: condicion,
        include: includeModelsPersona
    });
};

const findPersonaUnique = persona => {
    return Models.Persona.findOne({
        where: {
            id: { [Op.ne]: persona.id },
            documento: persona.documento
        }
    });
};

const findOnePersonaAcudiente = documento => {
    return Models.Persona.findOne({
        where: {
            documento: documento,
            [Op.and]: sequelize.where(
                sequelize.literal("date_part('year', now()) - date_part('year', fecha_nacimiento)"), '>=', 18
            )
        },
        include: includeModelsPersona
    });
};

const findAllPersona = (limit = 10, offset = 0, search_term = '', id_rol) => {
    const condicion = {
        [Op.or]: [
            {
                primer_nombre: {
                    [Op.iLike]: `%${ search_term }%`
                }
            },
            {
                primer_apellido: {
                    [Op.iLike]: `%${ search_term }%`
                }
            },
            {
                documento: {
                    [Op.iLike]: `%${ search_term }%`
                }
            }
        ]
    };
    if (id_rol) condicion.id_rol = id_rol;

    return Models.Persona.findAndCountAll({
        where: condicion,
        include: [
            ...includeModelsPersona,
            {
                model: Models.Usuario,
                as: 'usuario'
            }
        ],
        order: [
            // ['primer_nombre', 'ASC'],
            // ['primer_apellido', 'ASC'],
            ['id', 'DESC']
        ],
        limit: limit,
        offset: offset
    });
};

const findOrCreatePersona = (persona, transaction = null) => {
    return Models.Persona.findOrCreate({
        where: { documento: persona.documento },
        defaults: persona,
        transaction: transaction
    });
};

const createPersona = (persona, transaction = null) => {
    return Models.Persona.create(persona, { transaction: transaction });
};

const updatePersona = (persona, id, transaction = null) => {
    return Models.Persona.update(persona, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyPersona = (id, transaction = null) => {
    return Models.Persona.destroy({
        where: { id: id },
        transaction: transaction
    });
};

const bulkCreatePersona = personas => {
    return Models.Persona.bulkCreate(personas);
};

module.exports = {
    findByPkPersona,
    findPersonaPorDocumento,
    findPersonaUnique,
    findOnePersonaAcudiente,
    findEstudianteIsMatriculado,
    findAllPersona,
    findOrCreatePersona,
    createPersona,
    updatePersona,
    destroyPersona,
    bulkCreatePersona
};