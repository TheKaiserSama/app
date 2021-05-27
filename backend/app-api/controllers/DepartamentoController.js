const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const db = require('../../app-core/models/index');
const Departamento = db.Departamento;

exports.getByPkDepartamento = async (req, res, next) => {
    try {
        const { id } = req.params;
        const departamento = await Departamento.findByPk(id);
        if (!departamento) {
            throw new HttpNotFound(`Departamento con id='${ id }' no encontrado.`);
        }
        response(res, departamento, 'Datos departamento.');
    } catch (error) {
        next(error);
    }
};

exports.getAllDepartamentos = async (req, res, next) => {
    try {
        let message = 'Datos departamentos.';
        const departamentos = await Departamento.findAll({
            order: [['nombre', 'ASC']]
        });
        if (departamentos.length === 0) {
            message = 'No hay departamentos para listar.';
        }
        response(res, departamentos, message);
    } catch (error) {
        next(error);
    }
};