const Models = require('../models/index');

const includeModelsUsuario = [
    {
        model: Models.Persona,
        as: 'persona',
        required: true
    },
    {
        model: Models.Rol,
        as: 'rol',
        require: true
    }
];

const findByPkUsuario = id => {
    return Models.Usuario.findByPk(id, {
        include: includeModelsUsuario
    });
};

const findOneUsuario = id => {
    return Models.Usuario.findOne({
        where: { id: id },
        include: includeModelsUsuario
    });
};

const findOneUsuarioByUsername = username => {
    return Models.Usuario.findOne({
        where: { username: username },
        include: includeModelsUsuario
    });
};

const findUsuarioByPkPersona = id => {
    return Models.Usuario.findOne({
        where: { id_persona: id },
        include: includeModelsUsuario
    })
}

const findAllUsuario = () => {
    return Models.Usuario.findAll({});
};

const findOrCreateUsuario = (usuario, transaction = null) => {
    return Models.Usuario.findOrCreate({
        where: { username: usuario.username },
        defaults: usuario,
        transaction: transaction
    });
};

const createUsuario = usuario => {
    return Models.Usuario.create(usuario);
};

const updateUsuario = (usuario, id) => {
    return Models.Usuario.update(usuario, {
        where: { id: id },
        returning: true
    });
};

const destroyUsuario = id => {
    return Models.Usuario.destroy({
        where: { id: id }
    });
};

const findPersonaInUsuario = id_persona => {
    return Models.Usuario.findOne({
        where: { id_persona: id_persona }
    });
};

module.exports = {
    findByPkUsuario,
    findOneUsuario,
    findOneUsuarioByUsername,
    findUsuarioByPkPersona,
    findOrCreateUsuario,
    findAllUsuario,
    createUsuario,
    updateUsuario,
    destroyUsuario,
    findPersonaInUsuario
};