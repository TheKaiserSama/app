const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { sequelize } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Institucion = db.Institucion;

exports.getByPkInstitucion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const institucion = await Institucion.findByPk(id);
        if (!institucion) {
            throw new HttpNotFound(`Registro con id=${ id } no encontrado.`);
        }
        response(res, institucion, 'Datos institución.');
    } catch (error) {
        next(error);
    }
};

exports.getAllInstituciones = async (req, res, next) => {
    try {
        let message = 'Datos instituciones.';
        const instituciones = await Institucion.findAll({ order: [['nombre', 'ASC']] });
        if (instituciones.length === 0) {
            message = 'No hay instituciones para listar.';
        }
        response(res, instituciones, message);
    } catch (error) {
        next(error);
    }
};

exports.createInstitucion = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let created = false;
        let message = 'Ya existe una institución creada.';
        const { nombre, descripcion, mision, vision, himno, lema } = req.body;
        const instituciones = await Institucion.findAll({ transaction });
        if (instituciones.length === 0) {
            const newInstitucion = { nombre, descripcion, mision, vision, himno, lema };
            const createdInstitucion = await Institucion.create(newInstitucion, { transaction });
            if (createdInstitucion) {
                created = true;
                message = 'Registro creado exitosamente.';
            }
        }
        await transaction.commit();
        response(res, created, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.updateInstitucion = async (req, res, next) => {
    try {
        let affectedCount = 0;
        let message = 'Ya existe un registro con la información suministrada.';
        let updated = false;
        const { id } = req.params;
        const { nombre, descripcion, mision, vision, himno, lema } = req.body;
        if (id) {
            const dataInstitucion = { nombre, descripcion, mision, vision, himno, lema };
            [affectedCount] = await Institucion.update(dataInstitucion, { where: { id } });
            if (affectedCount > 0) {
                updated = true;
                message = 'Registro actualizado exitosamente.';
            }
        }
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        next(error);
    }
};