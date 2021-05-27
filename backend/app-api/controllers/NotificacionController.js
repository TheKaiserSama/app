const { modelsNotificacion } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Notificacion = db.Notificacion;

exports.getByPkNotificacion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notificacion = await Notificacion.findByPk(id, { include: modelsNotificacion });
        
        if (!notificacion) {
            throw new HttpNotFound(`Notificación con id=${ id } no encontrada.`);
        }
        response(res, notificacion, 'Datos notificación.');
    } catch (error) {
        next(error);
    }
};

exports.getAllNotificacionesByPkEstudiante = async (req, res, next) => {
    try {
        const { id_estudiante } = req.params;
        const { limit, offset } = req.query;
        const notificaciones = await Notificacion.findAndCountAll({
            where: { id_estudiante },
            include: modelsNotificacion,
            order: [['id', 'DESC']],
            limit,
            offset
        });

        response(res, notificaciones, 'Datos notificaciones.');
    } catch (error) {
        next(error);
    }
};

exports.getAllNotificacionesByPkDocente = async (req, res, next) => {
    try {
        const { id_docente } = req.params;
        const { limit, offset, search_term = '', id_sede, id_anio_lectivo, id_grado, id_grupo, id_curso } = req.query;
        const condition = {
            [Op.or]: [
                { '$estudiante.persona.primer_nombre$': { [Op.iLike]: `%${ search_term }%` } },
                { '$estudiante.persona.primer_apellido$': { [Op.iLike]: `%${ search_term }%` } },
                { '$estudiante.persona.documento$': { [Op.iLike]: `%${ search_term }%` } },
            ]
        };
        if (id_docente) condition['$plan_docente.docente.id$'] = id_docente;
        if (id_sede) condition['$plan_docente.sede.id$'] = id_sede;
        if (id_anio_lectivo) condition['$plan_docente.anio_lectivo.id$'] = id_anio_lectivo;
        if (id_curso) condition['$plan_docente.id_curso$'] = id_curso;

        const notificaciones = await Notificacion.findAndCountAll({
            where: condition,
            include: modelsNotificacion,
            order: [['id', 'DESC']],
            limit,
            offset
        });

        response(res, notificaciones, 'Datos notificaciones.');
    } catch (error) {
        next(error);
    }
};

exports.getUltimasNotificaciones = async (req, res, next) => {
    try {
        const { id_estudiante } = req.params;
        const ultimasNotificaciones = await Notificacion.findAll({
            where: { id_estudiante },
            include: modelsNotificacion,
            order: [['id', 'DESC']],
            limit: 3
        });

        response(res, ultimasNotificaciones, 'Notificaciones.');
    } catch (error) {
        next(error);
    }
};

exports.createNotificacion = async (req, res, next) => {
    try {
        let message = 'Notificación creada exitosamente';
        const createdNotificacion = await Notificacion.create(req.body);
        if (!createdNotificacion) {
            message = 'No se pudo crear la notificación';
        }
        response(res, createdNotificacion, message);
    } catch (error) {
        next(error);
    }
};

exports.updateNotificacion = async (req, res, next) => {
    try {
        let message = 'Registro actualizado.', affectedRows = 0;
        const { id } = req.params;
        [affectedRows] = await Notificacion.update(req.body, {
            where: { id },
            returning: true
        });
        if (affectedRows < 1) {
            message = 'No se modificó el registro.';
        }
        response(res, { affectedRows }, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};

exports.destroyNotificacion = async (req, res, next) => {
    try {
        const { id } = req.params;
        let affectedRows = 0;
        let deleted = false;
        affectedRows = await Notificacion.destroy({ where: { id } });
        if (affectedRows > 0) {
            deleted = true;
        }
        response(res, { affectedRows, deleted }, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};