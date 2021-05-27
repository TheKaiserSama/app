const Models = require('../models/index');
const { Sequelize: { Op } } = require('../models/index');

const findByPkMateria = id => {
    return Models.Materia.findOne({
        where: { id: id }
    });
};

const findAllMateria = (limit = 10, offset = 0, search_term = '') => {
    return Models.Materia.findAndCountAll({
        where: {
            vigente: true,
            nombre: {
                [Op.iLike]: `%${ search_term }%`
            }
        },
        include: [
            {
                model: Models.Area,
                as: 'area',
                require: false
            }
        ],
        order: ['nombre'],
        limit: limit,
        offset: offset
    });
};

const findMateriaPorNombre = materia => {
    return Models.Materia.findOne({
        where: {
            id: { [Op.ne]: materia.id },
            nombre: materia.nombre
        }
    });
};

const findMateriaByArea = id => {
    return Models.Materia.findAll({
        where: { 
            id_area: id,
            vigente: true
        }
    });
};

const findOrCreateMateria = materia => {
    return Models.Materia.findOrCreate({
        where: { nombre: materia.nombre },
        defaults: materia
    });
};

const createMateria = materia => {
    return Models.Materia.create(materia);
};

const updateMateria = (materia, id) => {
    return Models.Materia.update(materia, {
        where: { id: id },
        returning: true
    });
};

const disableMateria = id => {
    return Models.Materia.update({ vigente: false }, {
        where: { id: id }
    });
};

const destroyMateria = id => {
    return Models.Materia.destroy({
        where: { id: id }
    });
};

module.exports = {
    findByPkMateria,
    findAllMateria,
    findMateriaPorNombre,
    findMateriaByArea,
    findOrCreateMateria,
    createMateria,
    updateMateria,
    disableMateria,
    destroyMateria
};