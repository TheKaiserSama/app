const { modelsActividad } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound, HttpBadRequest } = require('../error/customError');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Actividad = db.Actividad;

exports.getByPkActividad = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actividad = await Actividad.findByPk(id, { include: modelsActividad });
        if (!actividad) {
            throw new HttpNotFound(`Actividad con id=${ id } no encontrada.`);
        }
        response(res, actividad, 'Datos actividad.');
    } catch (error) {
        next(error);
    }
};

exports.getActividadesPorLogro = async (req, res, next) => {
    try {
        const { limit, offset, search_term, id_logro } = req.query;
        const actividades = await Actividad.findAndCountAll({
            where: {
                id_logro,
                [Op.or]: [
                    {
                        nombre: { [Op.iLike]: `%${ search_term }%` },
                        descripcion: { [Op.iLike]: `%${ search_term }%` },
                    }
                ]
            },
            include: modelsActividad,
            order: [['nombre', 'ASC'], ['descripcion', 'ASC']],
            limit,
            offset
        });
        let message = 'Datos actividades.';
        if (actividades.rows.length == 0) {
            message = 'No hay actividades para listar.';
        }
        response(res, actividades, message);
    } catch (error) {
        next(error);
    }
};

exports.getActividadPorLogro = async (req, res, next) => {
    try {
        const { id_logro } = req.params;
        const actividadesPorLogro = await Actividad.findAll({
            where: { id_logro },
            order: [['nombre', 'ASC'], ['descripcion', 'ASC']]
        });
        response(res, actividadesPorLogro, 'Datos actividades por logro.');
    } catch (error) {
        next(error);
    }
};

exports.bulkCreateActividad = async (req, res, next) => {
    try {
        const actividades = req.body;
        const createdActividades = await Actividad.bulkCreate(actividades, {
            validate: true,
            fields: ['nombre', 'descripcion', 'porcentaje', 'id_logro']
        });
        if (!createdActividades) {
            throw new HttpBadRequest('Hubo un error en el proceso de inserción.');
        }
        response(res, createdActividades, 'Actividades creadas exitosamente.');
    } catch (error) {
        next(error);
    }
};

exports.updateActividad = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const actividades = req.body;
        const listActividades = [];
        let newActividad;
        await Promise.all(actividades.map(async (actividad) => {
            if (actividad.id) {
                [, [newActividad]] = await Actividad.update(actividad, {
                    where: { id: actividad.id },
                    returning: true,
                    transaction
                });
            } else {
                newActividad = await Actividad.create(actividad, { transaction });
            }
            listActividades.push(newActividad);
        }));
        await transaction.commit();
        response(res, listActividades, 'Actividades actualizadas.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyActividades = async (req, res, next) => {
    try {
        let { id_actividades_to_remove } = req.query;
        id_actividades_to_remove = JSON.parse(id_actividades_to_remove);
        let affectedCount;
        let count = 0;

        await Promise.all(id_actividades_to_remove.map(async (id) => {
            affectedCount = await Actividad.destroy({ where: { id } });
            if (affectedCount) count++;
        }));
        response(res, count, `${ count } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};

exports.destroyActividadPorLogro = async (req, res, next) => {
    try {
        const { id } = req.params;
        const affectedRows = await Actividad.destroy({ where: { id_logro: id } });
        response(res, affectedRows, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};