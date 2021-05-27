const { modelsPeriodo } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { formatDate } = require('../helpers/date');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const Periodo = db.Periodo;

exports.getByPkPeriodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const periodo = await Periodo.findByPk(id, { include: modelsPeriodo });

        if (!periodo) {
            throw new HttpNotFound(`Periodo con id=${ id } no encontrado.`);
        }
        response(res, periodo, 'Datos periodo.');
    } catch (error) {
        next(error);
    }
};

exports.getPeriodosPorAnioLectivo = async (req, res, next) => {
    try {
        const { id_anio_lectivo } = req.params;
        const peridosPorAnioLectivo = await Periodo.findAll({
            where: { id_anio_lectivo },
            order: [['numero', 'ASC']]
        });
        if (!peridosPorAnioLectivo) {
            throw new HttpNotFound(`No hay periodos para el anio lectivo solicitado.`);
        }
        response(res, peridosPorAnioLectivo, 'Datos periodos.');
    } catch (error) {
        next(error);
    }
};

exports.getAllPeriodos = async (req, res, next) => {
    try {
        let { limit, offset, numero_anio_lectivo } = req.query;
        let numeroAnioLectivo = parseInt(numero_anio_lectivo);
        numeroAnioLectivo = (numeroAnioLectivo) ? numeroAnioLectivo : null;
        let message = 'Datos periodos.';
        const condition = {};
        if (numeroAnioLectivo) condition['$anio_lectivo.anio_actual$'] = numeroAnioLectivo;
        let periodos = await Periodo.findAndCountAll({
            where: condition,
            include: modelsPeriodo,
            order: [
                [ { model: AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC' ],
                [ 'numero', 'ASC' ]
            ],
            limit,
            offset
        });
        if (periodos.rows.length === 0) {
            message = 'No hay periodos para listar';
        }
        response(res, periodos, message);
    } catch (error) {
        next(error);
    }
};

exports.findOrCreatePeriodo = async (req, res, next) => {
    try {
        let created, message = 'Periodo creado exitosamente.';
        let { fecha_inicio, fecha_finalizacion, numero, descripcion = '', id_anio_lectivo } = req.body;
        fecha_inicio = formatDate(fecha_inicio);
        fecha_finalizacion = formatDate(fecha_finalizacion);
        const newPeriodo = {
            fecha_inicio,
            fecha_finalizacion,
            numero,
            descripcion,
            id_anio_lectivo
        };
        [, created] = await Periodo.findOrCreate({
            where: { numero, id_anio_lectivo },
            defaults: newPeriodo
        });
        if (!created) {
            message = 'Periodo duplicado, no se puede efectuar la operación.';
        }
        response(res, created, message);
    } catch (error) {
        next(error);
    }
};

exports.updatePeriodo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let { fecha_inicio, fecha_finalizacion, numero, descripcion = '', id_anio_lectivo } = req.body;
        const { id } = req.params;
        fecha_inicio = formatDate(fecha_inicio);
        fecha_finalizacion = formatDate(fecha_finalizacion);
        const newPeriodo = {
            fecha_inicio,
            fecha_finalizacion,
            numero,
            descripcion,
            id_anio_lectivo
        };
        let message = 'Ya existe un periodo con la información suministrada.', affectedCount = 0, updated = false;
        const foundPeriodo = await Periodo.findOne({
            where: { id: { [Op.ne]: id }, numero, id_anio_lectivo }
        });
        if (!foundPeriodo) {
            updated = true;
            message = 'Periodo actualizado exitosamente.';
            [affectedCount] = await Periodo.update(newPeriodo, { where: { id } });
        }

        await transaction.commit();
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyPeriodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPeriodo = await Periodo.destroy({ where: { id } });
        response(res, deletedPeriodo, 'Periodo eliminado.');
    } catch (error) {
        next(error);
    }
};