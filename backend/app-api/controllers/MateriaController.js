const { modelsMateria } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const hooks = require('../helpers/hooks');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Materia = db.Materia;

exports.getByPkMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const materia = await Materia.findByPk(id, { include: modelsMateria });
        if (!materia) {
            throw new HttpNotFound(`Materia con id=${ id } no encontrada.`);
        }
        response(res, materia, 'Datos materia.');
    } catch (error) {
        next(error);
    }
};

exports.getAllMaterias = async (req, res, next) => {
    try {
        let message = 'Datos materias.';
        const { limit, offset, search_term } = req.query;
        const materias = await Materia.findAndCountAll({
            where: {
                nombre: { [Op.iLike]: `%${ search_term }%` },
                vigente: true,
            },
            include: modelsMateria,
            order: [['nombre', 'ASC']],
            limit,
            offset
        });
        if (materias.rows.length === 0) {
            message = 'No hay materias para listar.';
        }
        response(res, materias, message);
    } catch (error) {
        next(error);
    }
};

exports.getMateriasByPkArea = async (req, res, next) => {
    try {
        let message = 'Datos materias.';
        const materias = await Materia.findAll({
            where: { id_area: req.params.id, vigente: true },
            include: modelsMateria
        });
        if (materias.length === 0) {
            message = 'No hay materias para el área seleccionada.';
        }
        response(res, materias, message);
    } catch (error) {
        next(error);
    }
};

exports.findOrCreateMateria = async (req, res, next) => {
    try {
        let created;
        let message = 'Materia creada exitosamente.';
        const { nombre, descripcion, id_area } = req.body;
        const materia = { nombre, descripcion, id_area };
        materia.nombre = hooks.capitalize(materia.nombre);
        [, created] = await Materia.findOrCreate({
            where: { nombre: materia.nombre },
            defaults: materia
        });
        if (!created) {
            message = 'Materia duplicada, no se puede efectuar la operación.';
        }
        response(res, created, message);
    } catch (error) {
        next(error);
    }
};

exports.createMateria = async (req, res, next) => {
    try {
        const { nombre, descripcion, id_area } = req.body;
        const materia = { nombre, descripcion, id_area };
        materia.nombre = hooks.capitalize(materia.nombre);
        const createdMateria = await Materia.create(materia);
        response(res, createdMateria, 'Materia creada exitosamente');
    } catch (error) {
        next(error);
    }
};

exports.updateMateria = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id } = req.params;
        const { nombre, descripcion, id_area } = req.body;
        const materia = { nombre, descripcion, id_area };
        materia.nombre = hooks.capitalize(nombre);
        let affectedCount = 0;
        let message = 'Ya existe una materia con la información suministrada.';
        let updated = false;
        const foundMateria = await Materia.findOne({
            where: {
                id: { [Op.ne]: id },
                nombre: materia.nombre
            },
            transaction
        });
        if (!foundMateria) {
            updated = true;
            message = 'Materia actualizada exitosamente.';
            [affectedCount] = await Materia.update(materia, { where: { id }, transaction });
        }
        await transaction.commit();
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedMateria = await Materia.destroy({ where: { id } });
        response(res, deletedMateria, 'Periodo eliminado.');
    } catch (error) {
        next(error);
    }
};