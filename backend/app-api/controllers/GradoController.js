const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { sequelize } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const Grado = db.Grado;

exports.getByPkGrado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const grado = await Grado.findByPk(id);
        if (!grado) {
            throw new HttpNotFound(`Grado con id=${ id } no encontrado.`);
        }
        response(res, grado, 'Datos del grado');
    } catch (error) {
        next(error);
    }
};

exports.getGradoPorDescripcion = async (req, res, next) => {
    try {
        const { descripcion } = req.params;
        const grado = await Grado.findOne({ where: { grado: descripcion } });
        if (!grado) {
            throw new HttpNotFound(`Grado con descripcion=${ descripcion } no encontrado.`);
        }
        response(res, grado, 'Datos del grado.');
    } catch (error) {
        next(error);
    }
};

exports.getAllGrados = async (req, res, next) => {
    try {
        const condition = {};
        if ('vigente' in req.query) {
            condition['vigente'] = req.query.vigente;
        }
        const grados = await Grado.findAll({ where: condition, order: [['grado', 'ASC']] });
        response(res, grados, 'Datos de los grados.');
    } catch (error) {
        next(error);
    }
};

exports.getGradosPorAnio = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { anio } = req.params;
        let gradosPorAnio = [];
        const anioLectivo = await AnioLectivo.findOne({ where: { anio_actual: anio }, transaction });
        if (anioLectivo) {
            // gradosPorAnio = await GradoDao.findGradoPorAnio(anioLectivo.id);
            gradosPorAnio = await sequelize.query(
                `
                    SELECT g.id, g.grado FROM grado AS g INNER JOIN 
                    (SELECT DISTINCT id_grado FROM curso
                    WHERE id_anio_lectivo = ${ anioLectivo.id }) AS c ON c.id_grado = g.id ORDER BY g.grado;
                `,
                { type: sequelize.QueryTypes.SELECT, transaction }
            );
        }
        // response(res, gradosPorAnio, `Grados para el año ${ getCurrentYear() }`);
        await transaction.commit();
        response(res, gradosPorAnio, `Grados para el año ${ anio }.`);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.findOrCreateGrado = async (req, res, next) => {
    try {
        const [, created] = await Grado.findOrCreate(req.body);
        response(res, created, 'Grado creado exitosamente.');
    } catch (error) {
        next(error);
    }
};

exports.updateGrado = async (req, res, next) => {
    try {
        let affectedCount = 0, { id } = req.params, updated = false;
        [affectedCount] = await Grado.update(req.body, { where: { id } });
        updated = affectedCount > 0 ? true : false;
        response(res, { affectedCount, updated }, `${ affectedCount } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};

exports.destroyGrado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const affectedRows = await Grado.destroy({ where: { id } });
        response(res, affectedRows, `Grado eliminado.`);
    } catch (error) {
        next(error);
    }
};