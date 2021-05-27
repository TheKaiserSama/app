const Models = require('../models/index');

const includeModels = [
    {
        model: Models.ValoracionFormativa,
        as: 'valoracion_formativa',
        required: true
    },
    {
        model: Models.Boletin,
        as: 'boletin',
        required: true
    }
];

const findByPk = (id, transaction = null) => {
    return Models.ValoracionCualitativa.findByPk(id, {
        transaction: transaction
    });
};

const findOne = (condition = {}, transaction = null) => {
    return Models.ValoracionCualitativa.findOne({
        where: { ...condition },
        include: includeModels,
        transaction: transaction
    });
};

const findAll = (condition = {}, order = [], transaction = null) => {
    return Models.ValoracionCualitativa.findAll({
        where: { ...condition },
        include: includeModels,
        order: order,
        transaction: transaction
    });
};

const findOrCreate = (valoracionCualitativa, transaction = null) => {
    const { id_valoracion_formativa, id_boletin } = valoracionCualitativa;
    return Models.ValoracionCualitativa.findOrCreate({
        where: {
            id_valoracion_formativa,
            id_boletin
        },
        defaults: valoracionCualitativa,
        transaction: transaction
    });
};

const create = (valoracionCualitativa, transaction = null) => {
    return Models.ValoracionCualitativa.create(valoracionCualitativa, {
        returning: true,
        transaction: transaction
    });
};

const bulkCreate = (valoracionCualitativa = [], transaction = null) => {
    return Models.ValoracionCualitativa.bulkCreate(valoracionCualitativa, {
        returning: true,
        transaction: transaction
    });
};

const update = (valoracionCualitativa, condition = {}, transaction = null) => {
    return Models.ValoracionCualitativa.update(valoracionCualitativa, {
        where: { ...condition },
        returning: true,
        transaction: transaction
    });
};

const destroy = (condition = {}, transaction = null) => {
    return Models.ValoracionCualitativa.destroy({
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
    bulkCreate,
    update,
    destroy
};