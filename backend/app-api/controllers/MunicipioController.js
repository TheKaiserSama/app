const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const db = require('../../app-core/models/index');
const Municipio = db.Municipio;

exports.getByPkMunicipio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const municipio = await Municipio.findByPk(id);
        if (!municipio) {
            throw new HttpNotFound(`Municipio con id=${ id } no encontrado.`)
        }
        response(res, municipio, 'Datos municipio.');
    } catch (error) {
        next(error)
    }
};

exports.getMunicipiosPorDepartamento = async (req, res, next) => {
    try {
        let message = 'Datos municipios.';
        const { id } = req.params;
        const municipios = await Municipio.findAll({
            where: { id_departamento: id },
            order: [['nombre', 'ASC']]
        });
        if (municipios.length === 0) {
            message = 'No hay municipios para el departamento solicitado.';
        }
        response(res, municipios, message)
    } catch (error) {
        next(error)
    }
};