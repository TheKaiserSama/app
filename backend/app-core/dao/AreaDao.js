const { Area, Materia, Sequelize: { Op } } = require('../models/index');

const findByPkArea = (id, transaction = null) => {
    return Area.findByPk(id, {
        include: [
            {
                model: Materia,
                as: 'materia'
            }
        ],
        transaction: transaction
    });
};

const findAllArea = () => {
    return Area.findAll({
        order: ['nombre']
    });
};

const findAreaPorNombre = area => {
    return Area.findOne({
        where: {
            id: { [Op.ne]: area.id },
            nombre: area.nombre
        }
    });
};

const findAllAreaPaginate = (limit = 10, offset = 0, search_term = '') => {
    return Area.findAndCountAll({
        where: {
            nombre: {
                [Op.iLike]: `%${ search_term }%`
            }
        },
        order: ['nombre'],
        limit: limit,
        offset: offset
    });
};

const findOrCreateArea = (area, transaction = null) => {
    return Area.findOrCreate({
        where: { nombre: area.nombre },
        defaults: area,
        transaction: transaction
    });
};

const createArea = area => {
    return Area.create(area);
};

const updateArea = (area, id) => {
    return Area.update(area, {
        where: { id: id },
        returning: true
    })
};

const destroyArea = id => {
    return Area.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkArea,
    findAllArea,
    findAreaPorNombre,
    findAllAreaPaginate,
    findOrCreateArea,
    createArea,
    updateArea,
    destroyArea
};