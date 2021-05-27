const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index');

const includeModels = [
    {
        model: Models.EstadoDocente,
        as: 'estado_docente',
        required: true
    },
    {
        model: Models.Persona,
        as: 'persona',
        required: true,
        include: [
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
        ]
    }
];

const findByPkDocente = (id, transaction = null) => {
    return Models.Docente.findByPk(id, {
        include: includeModels,
        transaction: transaction
    });
};

const findManyDocentes = (params = {}, order = [], transaction = null) => {
    return Models.Docente.findAll({
        where: { ...params },
        include: [
            ...includeModels,
            {
                model: Models.DirectorGrupo,
                as: 'director_grupo',
                required: false
            },
        ],
        order: order,
        transaction: transaction
    })
};

const findDocenteByCodigo = (codigo, transaction = null) => {
    return Models.Docente.findOne({
        where: { codigo: codigo },
        include: includeModels,
        transaction: transaction
    });
};

const findDocenteByPkPersona = (id, transaction = null) => {
    return Models.Docente.findOne({
        where: { id_persona: id },
        include: includeModels,
        transaction: transaction
    });
};

const findAllDocente = (limit = 10, offset = 0, searchTerm = '') => {
    return Models.Docente.findAndCountAll({
        where: {
            [Op.or]: [
                { '$persona.primer_nombre$': { [Op.iLike]: `%${ searchTerm }%` } },
                { '$persona.primer_apellido$': { [Op.iLike]: `%${ searchTerm }%` } },
                { '$persona.documento$': { [Op.iLike]: `%${ searchTerm }%` } }
            ]
        },
        include: includeModels,
        order: [
            [ { model: Models.Persona, as: 'persona'}, 'primer_nombre', 'ASC' ],
            [ { model: Models.Persona, as: 'persona'}, 'primer_apellido', 'ASC' ]
        ],
        limit: limit,
        offset: offset
    });
};

const findOrCreateDocente = (docente, transaction = null) => {
    return Models.Docente.findOrCreate({
        where: { id_persona: docente.id_persona },
        defaults: docente,
        transaction: transaction
    });
};

const createDocente = docente => {
    return Models.Docente.create(docente);
};

const updateDocente = (docente, id, transaction = null) => {
    return Models.Docente.update(docente, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyDocente = (id, transaction = null) => {
    return Models.Docente.destroy({
        where: { id: id },
        transaction: transaction
    });
};

const disableDocente = (id, transaction = null) => {
    return Models.Docente.update({ vigente: false }, {
        where: { id: id },
        transaction: transaction
    });
};

///////////////////////////////
const findByPk = (id, transaction = null) => {
    return Models.Docente.findByPk(id, {
        transaction: transaction,
        include: includeModels
    });
};

const findAll = (condition = {}, order = [], transaction = null) => {
    return Models.Docente.findAll({
        where: { ...condition },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};

module.exports = {
    findByPkDocente,
    findManyDocentes,
    findDocenteByCodigo,
    findDocenteByPkPersona,
    findAllDocente,
    findOrCreateDocente,
    createDocente,
    updateDocente,
    destroyDocente,
    disableDocente,

    findByPk,
    findAll
};