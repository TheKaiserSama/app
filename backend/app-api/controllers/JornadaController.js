const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const db = require('../../app-core/models/index');
const Jornada = db.Jornada;

exports.getByPkJornada = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jornada = await Jornada.findByPk(id);
        if (!jornada) {
            throw new HttpNotFound(`Jornada con id='${ id }' no encontrada.`);
        }
        response(res, jornada, 'Datos jornada.');
    } catch (error) {
        next(error);
    }
};

exports.getAllJornadas = async (req, res, next) => {
    try {
        let message = 'Datos jornadas';
        const jornadas = await Jornada.findAll({
            order: [['id', 'ASC']]
        });
        if (jornadas.length === 0) {
            message = 'No hay jornadas para listar.';
        }
        response(res, jornadas, message);
    } catch (error) {
        next(error);
    }
};