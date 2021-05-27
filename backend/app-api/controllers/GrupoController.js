const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Grupo = db.Grupo;

exports.getByPkGrupo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const grupo = await Grupo.findByPk(id);
        if (!grupo) {
            throw new HttpNotFound(`Grupo con id=${ id } no encontrado.`);
        }
        response(res, grupo, 'Datos del grupo.');
    } catch (error) {
        next(error);
    }
};

exports.getGrupoPorDescripcion = async (req, res, next) => {
    try {
        const { descripcion } = req.params;
        const grupo = await Grupo.findOne({ where: { descripcion } });
        if (!grupo) {
            throw new HttpNotFound(`Grupo con descripcion=${ descripcion } no encontrado.`);
        }
        response(res, grupo, 'Datos del grado.');
    } catch (error) {
        next(error);
    }
};

exports.getAllGrupos = async (req, res, next) => {
    try {
        const condition = {};
        if ('vigente' in req.query) {
            condition['vigente'] = req.query.vigente;
        }
        const grupos = await Grupo.findAll({
            where: condition,
            order: [['descripcion', 'ASC']]
        });
        response(res, grupos, 'Datos de los grupos.');
    } catch (error) {
        next(error);
    }
};

exports.findOrCreateGrupo = async (req, res, next) => {
    try {
        const { descripcion, vigente } = req.body;
        const grupo = { descripcion, vigente };
        grupo.descripcion = descripcion.toString();
        const [, created] = await Grupo.findOrCreate({
            where: { descripcion: grupo.descripcion },
            defaults: grupo
        });
        response(res, created, 'Grupo creado exitosamente.');
    } catch (error) {
        next(error);
    }
};

exports.updateGrupo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let affectedCount = 0;
        let updated = false;
        const { id } = req.params;
        const { descripcion, vigente } = req.body;
        const newGrupo = { descripcion, vigente };
        newGrupo.descripcion = descripcion.toString();

        const grupo = await Grupo.findOne({
            where: { id: { [Op.ne]: id }, descripcion: newGrupo.descripcion },
            transaction
        });
        if (!grupo) {
            updated = true;
            [affectedCount] = await Grupo.update(newGrupo, { where: { id }, transaction });
        }
        await transaction.commit();
        response(res, { affectedCount, updated }, `${ affectedCount } registro(s) afectado(s).`);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyGrupo = async (req, res, next) => {
    try {
        const { id } = req.params;
        let affectedRows = 0;
        let deleted = false;
        affectedRows = await Grupo.destroy({ where: { id } });
        if (affectedRows > 0) deleted = true;
        response(res, { affectedRows, deleted }, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};