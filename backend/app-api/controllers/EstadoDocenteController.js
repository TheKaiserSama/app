const response = require('../helpers/response');
const db = require('../../app-core/models/index');
const EstadoDocente = db.EstadoDocente;

exports.getByPkEstadoDocente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estadoDocente = await EstadoDocente.findByPk(id);
        if (!estadoDocente) {
            throw new HttpNotFound(`Estado docente con id='${ id }' no encontrado.`);
        }
        response(res, estadoDocente, 'Datos estado docente.');
    } catch (error) {
        next(error);
    }
};

exports.getAllEstadosDocente = async (req, res, next) => {
    try {
        let message = 'Datos estados docente.';
        const estadosDocente = await EstadoDocente.findAll({
            order: [['id', 'ASC']]
        });
        if (estadosDocente.length == 0) {
            message = 'No hay estados docente para listar.'
        }
        response(res, estadosDocente, message);
    } catch (error) {
        next(error);
    }
};