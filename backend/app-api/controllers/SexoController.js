const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const db = require('../../app-core/models/index');
const Sexo = db.Sexo;

exports.getByPkSexo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sexo = await Sexo.findByPk(id);
        if (!sexo) {
            throw new HttpNotFound(`Sexo con id='${ id }' no encontrado.`);
        }
        response(res, sexo, 'Datos sexo.');
    } catch (error) {
        next(error);
    }
};

exports.getAllSexos = async (req, res, next) => {
    try {
        let message = 'Datos sexos.';
        const sexos = await Sexo.findAll({ order: [['nombre', 'ASC']] });
        if (sexos.length === 0) {
            message = 'No hay sexos para listar.';
        }
        response(res, sexos, message);
    } catch (error) {
        next(error);
    }
};