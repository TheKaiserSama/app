const Models = require('../models/index');

const includeModels = [
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

const findByPkEstudiante = id => {
    return Models.Estudiante.findByPk(id);
};

/* Adecuar estas dos consultas para este modelo */
// const findByPkDocente = (id, transaction = null) => {
//     return Models.Docente.findByPk(id, {
//         include: includeModelsDocente,
//         transaction: transaction
//     });
// };

// const findOneDocenteByCodigo = (codigo, transaction = null) => {
//     return Models.Docente.findOne({
//         where: { codigo: codigo },
//         include: includeModelsDocente,
//         transaction: transaction
//     });
// };

const findOneEstudiante = (id, transaction = null) => {
    return Models.Estudiante.findOne({
        where: { id: id },
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
        ],
        transaction: transaction
    });
};

const findEstudiantePorDocumento = documento => {
    return Models.Estudiante.findOne({
        where: {
            '$persona.documento$': documento
        },
        include: [
            {
                model: Models.Persona,
                as: 'persona',
                required: true,
                include: includeModels
            }
        ]
    });
};

const findEstudiantePorPersona = (id_persona, transaction = null) => {
    return Models.Estudiante.findOne({
        where: { id_persona: id_persona },
        include: [
            {
                model: Models.Persona,
                as: 'persona',
                required: true
            }
        ],
        transaction: transaction
    });
};

const findAllEstudiante = () => {
    return Models.Estudiante.findAll({});
};

const findOrCreateEstudiante = (estudiante, transaction = null) => {
    return Models.Estudiante.findOrCreate({
        where: { id_persona: estudiante.id_persona },
        defaults: estudiante,
        transaction: transaction
    });
};

const createEstudiante = (estudiante, transaction = null) => {
    return Models.Estudiante.create(estudiante, { transaction: transaction });
};

const updateEstudiante = (estudiante, id, transaction = null) => {
    return Models.Estudiante.update(estudiante, {
        where: { id: id },
        returning: true,
        transaction: transaction
    });
};

const destroyEstudiante = id => {
    return Models.Estudiante.destroy({
        where: { id: id }
    });
};

const disableEstudiante = id => {
    return Models.Estudiante.update({ vigente: false }, {
        where: { id: id },
        returning: true
    });
};

/*************************/
const findByPk = (id, transaction = null) => {
    return Models.Estudiante.findByPk(id, {
        transaction: transaction,
        include: [
            {
                model: Models.Persona,
                as: 'persona',
                required: true,
                include: includeModels
            }
        ]
    });
};

module.exports = {
    findByPkEstudiante,
    findOneEstudiante,
    findEstudiantePorDocumento,
    findEstudiantePorPersona,
    findAllEstudiante,
    findOrCreateEstudiante,
    createEstudiante,
    updateEstudiante,
    destroyEstudiante,
    disableEstudiante,

    findByPk
};