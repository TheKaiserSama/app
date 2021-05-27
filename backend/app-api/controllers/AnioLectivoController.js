const { modelsAnioLectivo } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const Periodo = db.Periodo;

exports.getByPkAnioLectivo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const anioLectivo = await AnioLectivo.findByPk(id, { include: modelsAnioLectivo });
        if (!anioLectivo) {
            throw new HttpNotFound(`Año lectivo con id=${ id } no encontrado.`);
        }
        response(res, anioLectivo, 'Datos año lectivo.');
    } catch (error) {
        next(error);
    }
};

exports.getAnioLectivoPorNumero = async (req, res, next) => {
    try {
        const { anio } = req.params;
        const anioLectivo = await AnioLectivo.findOne({ where: { anio_actual: anio }, include: modelsAnioLectivo });
        if (!anioLectivo) {
            throw new HttpNotFound(`Anio lectivo con año=${ anio } no encontrado.`);
        }
        response(res, anioLectivo, 'Datos año lectivo.');
    } catch (error) {
        next(error);
    }
};

exports.getAllAniosLectivos = async (req, res, next) => {
    try {
        const condition = {};
        if ('vigente' in req.query) {
            condition['vigente'] = req.query.vigente;
        }
        const aniosLectivos = await AnioLectivo.findAll({
            where: condition,
            include: modelsAnioLectivo,
            order: [['anio_actual', 'DESC']]
        });

        response(res, aniosLectivos, 'Datos años lectivos.');
    } catch (error) {
        next(error);
    }
};

exports.findOrCreateAnioLectivo = async (req, res, next) => {
    try {
        let message = 'Año lectivo creado exitosamente.';
        const { anio_actual, descripcion, vigente, id_estado_anio_lectivo, id_rango } = req.body;
        const [, created] = await AnioLectivo.findOrCreate({
            where: { anio_actual },
            defaults: {
                anio_actual,
                descripcion,
                vigente,
                id_estado_anio_lectivo,
                id_rango
            }
        });
        if (!created) {
            message = 'Año lectivo duplicado, no se puede efectuar la operación.';
        }
        response(res, created, message);
    } catch (error) {
        next(error);
    }
};

exports.updateAnioLectivo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { anio_actual, descripcion, vigente, id_estado_anio_lectivo, id_rango } = req.body;
        let message = 'Ya existe un año lectivo con la información suministrada.';
        let affectedCount = 0;
        let updated = false;
        const newAnioLectivo = {
            id,
            anio_actual,
            descripcion,
            vigente,
            id_estado_anio_lectivo,
            id_rango
        };
        const anioLectivo = await AnioLectivo.findOne({
            where: {
                id: { [Op.ne]: id },
                anio_actual,
            }
        });
        if (!anioLectivo) {
            updated = true;
            message = 'Año lectivo actualizado exitosamente.';
            [affectedCount] = await AnioLectivo.update(newAnioLectivo, { where: { id } });
        }
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        next(error);
    }
};

exports.destroyAnioLectivo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let affectedRows = 0;
        let deleted = false;
        let message = 'No se puede eliminar, tiene registros asociadas.';
        const { id } = req.params;
        const periodos = await Periodo.findAll({
            where: { id_anio_lectivo: id },
            transaction
        });
        
        if (periodos.length == 0) {
            deleted = true;
            message = 'Año lectivo eliminado exitosamente.';
            affectedRows = await AnioLectivo.destroy({ where: { id }, transaction });
        }

        await transaction.commit();
        response(res, { affectedRows, deleted }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};