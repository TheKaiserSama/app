const { modelsCurso, modelsDirectorGrupo } = require('../helpers/includeModels');
const { HttpNotFound } = require('../error/customError');
const response = require('../helpers/response');
const { getCurrentYear } = require('../../app-api/helpers/date');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const Curso = db.Curso;
const DirectorGrupo = db.DirectorGrupo;
const Grado = db.Grado;
const Grupo = db.Grupo;
const Sede = db.Sede;
const currentYear = getCurrentYear();

exports.getByPkDirectorGrupo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const directorGrupo = await DirectorGrupo.findByPk(id, { include: modelsDirectorGrupo });
        if (!directorGrupo) {
            throw new HttpNotFound(`Director de grupo con id=${ id } no encontrado.`);
        }
        response(res, directorGrupo, 'Director de grupo.');
    } catch (error) {
        next(error);
    }
};

exports.getAllDirectoresGrupo = async (req, res, next) => {
    try {
        const { limit, offset, search_term = '', id_sede, id_anio_lectivo, id_curso } = req.query;
        const condition = {
            '$docente.vigente$': true,
            [Op.or]: [
                { '$docente.persona.primer_nombre$': { [Op.iLike]: `%${ search_term }%` } },
                { '$docente.persona.primer_apellido$': { [Op.iLike]: `%${ search_term }%` } },
                { '$docente.persona.documento$': { [Op.iLike]: `%${ search_term }%` } }
            ]
        };
        if (id_sede) condition['$curso.sede.id$'] = id_sede;
        if (id_anio_lectivo) condition.id_anio_lectivo = id_anio_lectivo;
        if (id_curso) condition.id_curso = id_curso;

        const directoresGrupo = await DirectorGrupo.findAndCountAll({
            where: condition,
            include: modelsDirectorGrupo,
            order: [
                [{ model: Curso, as: 'curso' }, { model: Sede, as: 'sede' }, 'nombre', 'ASC'],
                [{ model: AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC'],
                [{ model: Curso, as: 'curso' }, { model: Grado, as: 'grado' }, 'grado', 'ASC'],
                [{ model: Curso, as: 'curso' }, { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC']
            ],
            limit,
            offset
        });
        response(res, directoresGrupo, 'Directores de grupo.');
    } catch (error) {
        next(error);
    }
};

exports.getDirectoresPorAnioLectivo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const anioLectivo = await AnioLectivo.findOne({
            where: { anio_actual: currentYear },
            transaction
        });
        const { id: id_anio_lectivo } = anioLectivo;
        const cursos = await Curso.findAll({
            where: { id_anio_lectivo },
            include: modelsCurso,
            order: [
                [{ model: Sede, as: 'sede' }, 'nombre', 'ASC'],
                [{ model: Grado, as: 'grado' }, 'grado', 'ASC'],
                [{ model: Grupo, as: 'grupo' }, 'descripcion', 'ASC'],
            ],
            transaction
        });
        const results = [];
        await Promise.all(cursos.map(async (curso) => {
            const dataDirectorGrupo = await DirectorGrupo.findOne({
                where: { id_curso: curso.id, id_anio_lectivo },
                include: modelsDirectorGrupo,
                transaction
            });
            if (dataDirectorGrupo) {
                results.push(dataDirectorGrupo);
            } else {
                const nuevoDirectorGrupo = {
                    id_anio_lectivo: parseInt(id_anio_lectivo),
                    id_curso: curso.id,
                    id_docente: null,
                    anio_lectivo: anioLectivo,
                    curso: curso,
                    docente: null
                };
                results.push(nuevoDirectorGrupo);
            }
        }));

        await transaction.commit();
        response(res, results, 'Datos cursos.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.getCursosAsignadosADirector = async (req, res, next) => {
    try {
        const { id_docente } = req.params;
        const { id_anio_lectivo } = req.query;
        const directoresGrupo = await DirectorGrupo.findAll({
            where: { id_docente, id_anio_lectivo },
            include: modelsDirectorGrupo,
            order: [
                [{ model: Curso, as: 'curso' }, { model: Grado, as: 'grado' }, 'grado', 'ASC'],
                [{ model: Curso, as: 'curso' }, { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC']
            ]
        });
        const cursos = directoresGrupo.map(({ curso }) => curso);
        response(res, cursos, 'Cursos asignados.');
    } catch (error) {
        next(error);
    }
};

exports.createDirectorGrupo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_anio_lectivo, id_curso, id_docente } = req.body;
        const datosDirectorGrupo = { id_anio_lectivo, id_curso, id_docente };
        let wasCreated = false;
        const directorGrupo = await DirectorGrupo.findOne({
            where: { id_anio_lectivo, id_curso },
            transaction
        });
        if (!directorGrupo) {
            const createdDirectorGrupo = await DirectorGrupo.create(datosDirectorGrupo, {
                transaction
            });
            if (createdDirectorGrupo) wasCreated = true;
        }
        transaction.commit();
        response(res, wasCreated, 'Director de grupo.');
    } catch (error) {
        if (transaction) transaction.rollback();
        next(error);
    }
};

exports.destroyDirectorGrupo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const affectedRows = await DirectorGrupo.destroy({ where: { id }});
        response(res, affectedRows, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};