const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const db = require('../../app-core/models/index');
const Rango = db.Rango;

exports.getByPkRango = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rango = await Rango.findByPk(id);
        if (!rango) {
            throw new HttpNotFound(`Rango con id=${ id } no encontrado.`);
        }
        response(res, rango, 'Datos rango.');
    } catch (error) {
        next(error);
    }
};

exports.getAllRangos = async (req, res, next) => {
    try {
        let message = 'Datos rangos.';
        const rangos = await Rango.findAll({ order: [['id', 'ASC']] });
        if (rangos.length === 0) {
            message = 'No hay rangos para listar.';
        }
        response(res, rangos, message);
    } catch (error) {
        next(error);
    }
};

exports.createRango = async (req, res, next) => {
    try {
        const { descripcion, nota_minima, nota_maxima } = req.body;
        const rango = { descripcion, nota_minima, nota_maxima };
        const createdRango = await Rango.create(rango);
        response(res, createdRango, 'Rango creado exitosamente.');
    } catch (error) {
        next(error);
    }
};

exports.updateRango = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { descripcion, nota_minima, nota_maxima } = req.body;
        const rango = { descripcion, nota_minima, nota_maxima };
        const results = await Rango.update(rango, { where: { id } });
        const [affectedCount, affectedRows] = results;
        response(res, { affectedCount, affectedRows }, `${ affectedCount } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};

exports.destroyRango = async (req, res, next) => {
    try {
        const { id } = req.params;
        const affectedRows = await Rango.destroy({ where: { id } });
        response(res, { affectedRows }, `${ affectedRows } registro(s) afectado(s)`)
    } catch (error) {
        next(error);
    }
};