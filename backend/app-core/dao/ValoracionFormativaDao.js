const Models = require('../models/index');

const includeModels = [];

const findByPk = (id, transaction = null) => {
    return Models.ValoracionFormativa.findByPk(id, {
        transaction: transaction
    });
};

const findOne = (condition = {}, transaction = null) => {
    return Models.ValoracionFormativa.findOne({
        where: { ...condition },
        include: includeModels,
        transaction: transaction
    });
};

const findAll = (condition = {}, order = [], transaction = null) => {
    return Models.ValoracionFormativa.findAll({
        where: { ...condition },
        order: order,
        transaction: transaction
    });
};

const create = (valoracionFormativa, transaction = null) => {
    return Models.ValoracionFormativa.create(valoracionFormativa, {
        returning: true,
        transaction: transaction
    });
};

const update = (valoracionFormativa, condition = {}, transaction = null) => {
    return Models.ValoracionFormativa.update(valoracionFormativa, {
        where: { ...condition },
        returning: true,
        transaction: transaction
    });
};

const destroy = (condition = {}, transaction = null) => {
    return Models.ValoracionFormativa.destroy({
        where: { ...condition },
        transaction: transaction
    });
};

module.exports = {
    findByPk,
    findOne,
    findAll,
    create,
    update,
    destroy
};