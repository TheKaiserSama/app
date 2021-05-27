const { modelsGradoMateria } = require('../helpers/includeModels');
const { HttpNotFound } = require('../error/customError');
const response = require('../helpers/response');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const Area = db.Area;
const Grado = db.Grado;
const GradoMateria = db.GradoMateria;
const Materia = db.Materia;

exports.getByPkGradoMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const gradoMateria = await GradoMateria.findByPk(id, { include: modelsGradoMateria });
        if (!gradoMateria) {
            throw new HttpNotFound(`Registro con id=${ id } no encontrado.`);
        }
        response(res, gradoMateria, 'Datos materias por grado.');
    } catch (error) {
        next(error);
    }
};

exports.getGradoMateriaParams = async (req, res, next) => {
    try {
        const { id_anio_lectivo, id_grado } = req.params;
        let message = 'Datos materias por grado.';
        let materias = await GradoMateria.findAll({
            where: { id_anio_lectivo, id_grado },
            include: modelsGradoMateria
        });
        if (!materias) {
            message = 'No hay materias para listar.';
        }
        response(res, materias, message);
    } catch (error) {
        next(error);
    }
};

exports.getAllGradosMaterias = async (req, res, next) => {
    try {
        const { limit, offset, id_anio_lectivo, id_grado, search_term } = req.query;
        let message = 'Datos materias por grado.';
        const condition = {};
        if (id_anio_lectivo) condition.id_anio_lectivo = id_anio_lectivo;
        if (id_grado) condition.id_grado = id_grado;
        if  (search_term) condition[Op.or] = [
            { '$materia.area.nombre$': { [Op.iLike]: `%${ search_term }%` } },
            { '$materia.nombre$': { [Op.iLike]: `%${ search_term }%` } }
        ];
        const materias = await GradoMateria.findAndCountAll({
            where: condition,
            include: modelsGradoMateria,
            order: [
                [ { model: AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC' ],
                [ { model: Grado, as: 'grado' }, 'grado', 'ASC' ],
                [ { model: Materia, as: 'materia' }, { model: Area, as: 'area' }, 'nombre', 'ASC' ],
                [ { model: Materia, as: 'materia' }, 'nombre', 'ASC' ]
            ],
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

exports.findOrCreateGradoMateria = async (req, res, next) => {
    try {
        let message = 'Registro duplicado, no se puede crear.';
        let created = false;
        const { id_anio_lectivo, id_grado, id_materia } = req.body;
        if (id_anio_lectivo && id_grado && id_materia) {
            const newGradoMateria = { id_anio_lectivo, id_grado, id_materia };
            [, created] = await GradoMateria.findOrCreate({
                where: newGradoMateria,
                defaults: newGradoMateria
            });
            if (created) message = 'Registro creado exitosamente.';
        }
        response(res, created, message);
    } catch (error) {
        next(error);
    }
};

exports.updateGradoMateria = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let message = 'Ya existe un registro con la información suministrada.';
        let affectedCount = 0;
        let updated = false;
        const { id } = req.params;
        const { id_anio_lectivo, id_grado, id_materia, vigente } = req.body;
        if (id_anio_lectivo && id_grado && id_materia) {
            const newGradoMateria = { id_anio_lectivo, id_grado, id_materia };
            const foundGradoMateria = await GradoMateria.findOne({
                where: {
                    id: { [Op.ne]: id },
                    ...newGradoMateria
                },
                include: modelsGradoMateria,
                transaction
            });
            if (!foundGradoMateria) {
                updated = true;
                message = 'Registro actualizado exitosamente.';
                [affectedCount] = await GradoMateria.update({ ...newGradoMateria, vigente }, { where: { id }, transaction });
            }
        }
        console.log(req.body);
        await transaction.commit();
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyGradoMateria = async (req, res, next) => {
    try {
        let { id } = req.params, message = 'Ningún registro eliminado.';
        const deletedGradoMateria = await GradoMateria.destroy({ where: { id } });
        if (deletedGradoMateria > 0) message = `${ deletedGradoMateria } registros eliminados.`;
        response(res, deletedGradoMateria, message);
    } catch (error) {
        next(error);
    }
};