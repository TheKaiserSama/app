const { modelsArea } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const hooks = require('../helpers/hooks');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Area = db.Area;
const Materia = db.Materia;

exports.getByPkArea = async (req, res, next) => {
    try {
        const { id } = req.params;
        const area = await Area.findByPk(id, { include: modelsArea });
        if (!area) {
            throw new HttpNotFound(`Área con id=${ id } no encontrada.`);
        }
        response(res, area, 'Datos área.');
    } catch (error) {
        next(error);
    }
};

exports.getAllAreas = async (req, res, next) => {
    try {
        let message = 'Datos áreas.';
        const areas = await Area.findAll({ order: [['nombre', 'ASC']] });
        if (areas.length == 0) {
            message = 'No hay áreas para listar.';
        }
        response(res, areas, message);
    } catch (error) {
        next(error);
    }
};

exports.getAllAreasPaginacion = async (req, res, next) => {
    try {
        const { limit, offset, search_term } = req.query;
        const areas = await Area.findAndCountAll({
            where: {
                nombre: { [Op.iLike]: `%${ search_term }%` }
            },
            order: [['nombre', 'ASC']],
            limit,
            offset
        });
        response(res, areas, 'Datos áreas.');
    } catch (error) {
        next(error);
    }
};

exports.findOrCreateArea = async (req, res, next) => {
    try {
        let created, message = 'Área creada exitosamente.';
        const { nombre, descripcion } = req.body;
        const area = { nombre, descripcion };
        area.nombre = hooks.capitalize(area.nombre);
        [, created] = await Area.findOrCreate({
            where: { nombre: area.nombre },
            defaults: area
        });
        if (!created) {
            message = 'Área duplicada, no se puede efectuar la operación.';
        }
        response(res, created, message);
    } catch (error) {
        next(error);
    }
};

exports.createArea = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const area = { nombre, descripcion };
        area.nombre = hooks.capitalize(area.nombre);
        const createdArea = await Area.create(area);
        response(res, createdArea, 'Área creada exitosamente.');
    } catch (error) {
        next(error);
    }
};

exports.updateArea = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const newArea = { nombre, descripcion };
        newArea.nombre = hooks.capitalize(nombre);
        let affectedCount = 0;
        let message = 'Ya existe un área con la información suministrada.';
        let updated = false;
        const foundArea = await Area.findOne({
            where: {
                id: { [Op.ne]: id },
                nombre: newArea.nombre
            },
            transaction
        });
        if (!foundArea) {
            updated = true;
            message = 'Área actualizada exitosamente.';
            [affectedCount] = await Area.update(newArea, { where: { id }, transaction });
        }
        await transaction.commit();
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyArea = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let affectedRows = 0;
        let deleted = false;
        let message = 'No se puede eliminar, tiene materias asociadas.';
        const { id } = req.params;
        const materias = await Materia.findAll({ where: { id_area: id }, transaction });
        if (materias.length == 0) {
            deleted = true;
            message = 'Área eliminada exitosamente.';
            affectedRows = await Area.destroy({ where: { id } });
        }
        await transaction.commit();
        response(res, { affectedRows, deleted }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};