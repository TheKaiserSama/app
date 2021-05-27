const response =  require('../helpers/response');
const db = require('../../app-core/models/index');
const EstadoEstudiante = db.EstadoEstudiante;

exports.getByPkEstadoEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estadoEstudiante = await EstadoEstudiante.findByPk(id);
        if (!estadoEstudiante) {
            throw new HttpNotFound(`Estado estudiante con id='${ id }' no encontrado.`);
        }
        response(res, estadoEstudiante, 'Datos estado estudiante.');
    } catch (error) {
        next(error);
    }
};

exports.getAllEstadosEstudiante = async (req, res, next) => {
    try {
        let message = 'Datos estados estudiante.';
        const estadosEstudiante = await EstadoEstudiante.findAll({
            order: [['id', 'ASC']]
        });
        if (estadosEstudiante.length === 0) {
            message = 'No hay estados estudiante para listar';
        }
        response(res, estadosEstudiante, message);
    } catch (error) {
        next(error);
    }
};