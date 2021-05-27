const { modelsCurso } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { getCurrentYear } = require('../helpers/date');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const Curso = db.Curso;
const Grado = db.Grado;
const Grupo = db.Grupo;
const Sede = db.Sede;
const currentYear = getCurrentYear();

exports.getByPkCurso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const curso = await Curso.findByPk(id, { include: modelsCurso });
        if (!curso) {
            throw new HttpNotFound(`Curso con id=${ id } no encontrado.`);
        }
        response(res, curso, 'Datos curso.');
    } catch (error) {
        next(error);
    }
};

exports.getAllCursos = async (req, res, next) => {
    try {
        const { limit, offset, id_sede, id_anio_lectivo, id_grado, id_grupo } = req.query;
        let message = 'Datos cursos.';
        const condition = {};
        if (id_sede) condition.id_sede = id_sede;
        if (id_anio_lectivo) condition.id_anio_lectivo = id_anio_lectivo;
        if (id_grado) condition.id_grado = id_grado;
        if (id_grupo) condition.id_grupo = id_grupo;

        const cursos = await Curso.findAndCountAll({
            where: condition,
            include: modelsCurso,
            order: [
                [ { model: AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC' ],
                [ { model: Sede, as: 'sede' }, 'nombre', 'ASC' ],
                [ { model: Grado, as: 'grado' }, 'grado', 'ASC' ],
                [ { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC' ]
            ],
            limit,
            offset
        });
        if (cursos.rows.length === 0) {
            message = 'No hay cursos para listar.';
        }
        response(res, cursos, message);
    } catch (error) {
        next(error);
    }
};

exports.getGrupoPorGrado = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let { id_sede, id_grado, id_anio_lectivo } = req.params;
        id_grado = parseInt(id_grado) ? id_grado : null;
        id_sede = parseInt(id_sede) ? id_sede : null;
        if (!parseInt(id_anio_lectivo)) {
            anioLectivo = await AnioLectivo.findOne({ where: { anio_actual: currentYear } });
            id_anio_lectivo = anioLectivo.id;
        }
        const grupoByGrado = await Curso.findAll({
            where: { id_sede, id_anio_lectivo, id_grado },
            include: modelsCurso,
            order: [
                [{ model: Grupo, as: 'grupo' }, 'descripcion', 'ASC']
            ],
            transaction
        });
        await transaction.commit();
        response(res, grupoByGrado, 'Datos grupos por grado.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.getCursoPorSede = async (req, res, next) => {
    try {
        let result = [];
        const { id_sede, id_anio_lectivo } = req.params;
        const grados = await Curso.findAll({
            where: { id_sede, id_anio_lectivo },
            include: modelsCurso,
            order: [[{ model: Grado, as: 'grado' }, 'grado', 'ASC']]
        });
        if (grados) {
            result = grados
                .map(({ grado }) => grado)
                .filter((grado, index, array) => array.findIndex(t => (t.id === grado.id)) === index);
        }
        response(res, result, 'Datos cursos.');
    } catch (error) {
        next(error);
    }
};

exports.getCursoPorSedeAnioLectivo = async (req, res, next) => {
    try {
        const { id_sede, id_anio_lectivo } = req.params;
        const cursos = await Curso.findAll({
            where: { id_sede, id_anio_lectivo },
            include: modelsCurso,
            order: [
                [ { model: Grado, as: 'grado' }, 'grado', 'ASC' ],
                [ { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC' ]
            ]
        });
        response(res, cursos, 'Datos cursos.');
    } catch (error) {
        next(error);
    }
};

exports.findOrCreateCurso = async (req, res, next) => {
    let transaction = await sequelize.transaction();
    try {
        let created = false;
        let message = 'Curso duplicado, no se puede crear.';
        const { id_sede, id_anio_lectivo, id_grado, id_grupo, id_jornada, cupo_maximo, cupo_utilizado } = req.body;
        const newCurso = {
            id_sede, id_anio_lectivo, id_grado, id_grupo, id_jornada
        };
        
        [, created] = await Curso.findOrCreate({
            where: newCurso,
            defaults: { ...newCurso, cupo_maximo, cupo_utilizado },
            transaction
        });

        if (created) {
            created = true;
            message = 'Curso creado.';
        }
        await transaction.commit();
        response(res, created, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.createCurso = async (req, res, next) => {
    try {
        const { id_sede, id_anio_lectivo, id_grado, id_grupo, id_jornada, cupo_maximo, cupo_utilizado } = req.body;
        const newCurso = {
            id_sede,
            id_anio_lectivo,
            id_grado,
            id_grupo,
            id_jornada,
            cupo_maximo,
            cupo_utilizado
        };
        const createdCurso = await Curso.create(newCurso);
        response(res, createdCurso, 'Curso creado exitosamente.');
    } catch (error) {
        next(error);
    }
};

exports.updateCurso = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let affectedCount = 0;
        let message = 'Ya existe un curso con la información suministrada.';
        let updated = false;
        const { id } = req.params;
        const { id_sede, id_anio_lectivo, id_grado, id_grupo, id_jornada, cupo_maximo, cupo_utilizado } = req.body;
        const newCurso = {
            id_sede, id_anio_lectivo, id_grado, id_grupo, id_jornada
        };
        const foundCurso = await Curso.findOne({
            where: {
                id: { [Op.ne]: id },
                ...newCurso
            },
            transaction
        });

        if (!foundCurso) {
            updated = true;
            message = 'Curso actualizado exitosamente.';
            const datosCurso = { ...newCurso, cupo_maximo, cupo_utilizado };
            [affectedCount] = await Curso.update(datosCurso, { where: { id }, transaction });
        }

        await transaction.commit();
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyCurso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCurso = await Curso.destroy({ where: { id } });
        response(res, deletedCurso, 'Curso eliminado.');
    } catch (error) {
        next(error);
    }
};