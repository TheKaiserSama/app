const { modelsSede } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Sede = db.Sede;

exports.getByPkSede = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sede = await Sede.findByPk(id, { include: modelsSede });
        if (!sede) {
            throw new HttpNotFound(`Sede con id=${ id } no encontrada.`);
        }
        response(res, sede, 'Datos sede.');
    } catch (error) {
        next(error);
    }
};

exports.getAllSedes = async (req, res, next) => {
    try {
        let message = 'Datos sedes';
        const sedes = await Sede.findAll({
            order: [['nombre', 'ASC']],
            include: modelsSede
        });
        if (sedes.length === 0) {
            message = 'No hay sedes para listar.';
        }
        response(res, sedes, message);
    } catch (error) {
        next(error);
    }
};

exports.getCountSedes = async (req, res, next) => {
    try {
        const countSedes = await Sede.count();
        response(res, countSedes, 'Cantidad de sedes.');
    } catch (error) {
        next(error);
    }
};

exports.findOrCreateSede = async (req, res, next) => {
    try {
        let created = false;
        let message = 'Sede duplicada, no se puede crear.';
        const { nombre, descripcion, direccion, telefono, id_institucion } = req.body;
        const newInstitucion = {
            nombre: nombre.toUpperCase(),
            descripcion, direccion, telefono, id_institucion
        };
        [, created] = await Sede.findOrCreate({
            where: { nombre: newInstitucion.nombre },
            defaults: newInstitucion
        });
        if (created) message = 'Sede creada exitosamente.';
        response(res, created, message);
    } catch (error) {
        next(error);
    }
};

exports.updateSede = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let affectedCount = 0;
        let message = 'Ya existe una sede con la información suministrada.';
        let updated = false;
        const { nombre, descripcion, direccion, telefono, id_institucion } = req.body;
        const { id } = req.params;
        const newSede = {
            nombre: nombre.toUpperCase(),
            descripcion, direccion, telefono, id_institucion };
        const foundSede = await Sede.findOne({
            where: {
                id: { [Op.ne]: id },
                nombre: newSede.nombre
            },
            transaction
        });

        if (!foundSede) {
            updated = true;
            message = 'Sede actualizada exitosamente.';
            [affectedCount] = await Sede.update(newSede, { where: { id }, transaction });
        }
        await transaction.commit();
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroySede = async (req, res, next) => {
    try {
        let { id } = req.params, message = 'Nigún registro eliminado.';
        const affectedRows = await Sede.destroy({ where: { id } });
        if (affectedRows > 0) message = `${ affectedRows } registro(s) afectado(s).`;
        response(res, { affectedRows }, message);
    } catch (error) {
        next(error);
    }
};