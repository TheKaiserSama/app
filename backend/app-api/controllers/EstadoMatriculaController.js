const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const db = require('../../app-core/models/index');
const EstadoMatricula = db.EstadoMatricula;

exports.getByPkEstadoMatricula = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estadoMatricula = await EstadoMatricula.findByPk(id);
        if (!estadoMatricula) {
            throw new HttpNotFound(`Estado matricula con id='${ id }' no encontrado.`);
        }
        response(res, estadoMatricula, 'Datos estado matricula.');
    } catch (error) {
        next(error);
    }
};

exports.getAllEstadosMatricula = async (req, res, next) => {
    try {
        let = message = 'Datos estados matricula.';
        const estadosMatriculas = await EstadoMatricula.findAll({
            order: [['id', 'ASC']]
        });
        if (estadosMatriculas.length === 0) {
            message = 'No hay estados matricula para listar.';
        }
        response(res, estadosMatriculas, message);
    } catch (error) {
        next(error);
    }
};