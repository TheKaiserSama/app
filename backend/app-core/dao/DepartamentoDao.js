const Models = require('../models/index');

const findByPkDepartamento = id => {
    return Models.Departamento.findByPk(id);
};

const findAllDepartamento = () => {
    return Models.Departamento.findAll({
        order: [
            ['nombre', 'ASC']
        ]
    });
};

const findDepartamentoWithMunicipio = ({limit = 5, offset = 0} = {}) => {
    return Models.Departamento.findAll({
        include: [
            {
                model: Models.Municipio,
                as: 'municipio',
                require: true
            }
        ],
        limit: limit,
        offset: offset,
        order: [
            ['nombre', 'ASC'],
            [ { model: Models.Municipio, as: 'municipio' }, 'nombre', 'ASC' ]
        ]
    });
};

module.exports = {
    findByPkDepartamento,
    findAllDepartamento,
    findDepartamentoWithMunicipio
};