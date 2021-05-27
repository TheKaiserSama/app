const Models = require('../models/index');

const findByPkMunicipio = id => {
    return Models.Municipio.findByPk(id);
};

const findMunicipioByDepartamento = id => {
    return Models.Municipio.findAll({
        where: { id_departamento: id }
    });
};

module.exports = {
    findByPkMunicipio,
    findMunicipioByDepartamento
};