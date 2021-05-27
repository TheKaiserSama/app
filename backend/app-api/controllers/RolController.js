const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { capitalize } = require('../helpers/hooks');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Rol = db.Rol;

exports.getByPkRol = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rol = await Rol.findByPk(id);
        if (!rol) {
            throw new HttpNotFound(`Rol con id=${ id } no encontrado.`);
        }
        response(res, rol, 'Datos del rol.');
    } catch (error) {
        next(error);
    }
};

exports.getAllRoles = async (req, res, next) => { // Refactorizar, buscar por id_rol [1,2,3] y no ['Estudiante', ... ]
    try {
        const { id_rol } = req.query;
        const arrayRol = id_rol ? JSON.parse(id_rol) : [];
        const newArray = arrayRol.map(item => item[0].toUpperCase() + item.slice(1));
        const condition = {};
        if (newArray.length > 0) {
            condition.nombre = {
                [Op.or]: [ ...arrayRol ]
            };
        }
        const roles = await Rol.findAll({
            where: condition,
            order: [['nombre', 'ASC']]
        });
        if (roles.length === 0) {
            return response(res, roles, 'No hay roles para listar.');
        }
        response(res, roles, 'Datos de roles.');
    } catch (error) {
        next(error);
    }
};

exports.createRol = async (req, res, next) => {
    try {
        let created, message = 'Rol creado exitosamente.';
        const { nombre, descripcion } = req.body;
        const rol = { nombre, descripcion };
        rol.nombre = capitalize(nombre);
        [, created] = await Rol.findOrCreate({
            where: { nombre: rol.nombre },
            defauls: rol
        });
        if (!created) {
            message = 'Rol duplicado, no se puede efectuar la operación.';
        }
        response(res, created, message);
    } catch (error) {
        next(error);
    }
};

exports.updateRol = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const newRol = { nombre, descripcion };
        newRol.nombre = capitalize(nombre);
        let affectedCount = 0;
        let message = 'Ya existe un rol con la información suministrada.';
        let updated = false;
        const foundRol = await Rol.findOne({
            where: {
                id: { [Op.ne]: id },
                nombre: newRol.nombre
            },
            transaction
        });
        if (!foundRol) {
            updated = true;
            message = 'Rol actualizado exitosamente.';
            [affectedCount] = await Rol.update(newRol, { where: { id }, transaction });
        }
        await transaction.commit();
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyRol = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPeriodo = await Rol.destroy({ where: { id } });
        response(res, deletedPeriodo, 'Periodo eliminado.');
    } catch (error) {
        next(error);
    }
};