const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const db = require('../../app-core/models/index');
const EstadoAnioLectivo = db.EstadoAnioLectivo;

exports.getByPkEstadoAnioLectivo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estadoAnioLectivo = await EstadoAnioLectivo.findByPk(id);
        if (!estadoAnioLectivo) {
            throw new HttpNotFound(`Estado año lectivo con id='${ id }' no encontrado.`);
        }
        response(res, estadoAnioLectivo, 'Datos estado año lectivo.');
    } catch (error) {
        next(error);
    }
};

exports.getAllEstadosAniosLectivos = async (req, res, next) => {
    try {
        let message = 'Datos estados años lectivos.';
        const estadosAniosLectivos = await EstadoAnioLectivo.findAll({
            order: [['id', 'ASC']]
        });
        if (estadosAniosLectivos.length === 0) {
            message = 'No hay estados años lectivos para listar.';
        }
        response(res, estadosAniosLectivos, message);
    } catch (error) {
        next(error);
    }
};