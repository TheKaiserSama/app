const { modelsLogro, modelsMatricula } = require('../helpers/includeModels');
const { HttpNotFound, HttpBadRequest } = require('../error/customError');
const response = require('../helpers/response');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const { getCurrentYear } = require('../helpers/date');
const Actividad = db.Actividad;
const Curso = db.Curso;
const Estudiante = db.Estudiante;
const EstudianteActividad = db.EstudianteActividad;
const EstudianteLogro = db.EstudianteLogro;
const Grado = db.Grado;
const Grupo = db.Grupo;
const Logro = db.Logro;
const Matricula = db.Matricula;
const Persona = db.Persona;
const PlanDocente = db.PlanDocente;
const currentYear = getCurrentYear();

exports.getByPkLogro = async (req, res, next) => {
    try {
        const { id } = req.params;
        const logro = await Logro.findByPk(id, { include: modelsLogro });
        if (!logro) {
            throw new HttpNotFound(`Logro con id=${ id } no encontrado.`);
        }
        response(res, logro, 'Datos logro.');
    } catch (error) {
        next(error);
    }
};

exports.getLogrosByPkPlanDocente = async (req, res, next) => {
    try {
        const { id_plan_docente } = req.params;
        const logros = await Logro.findAll({
            where: { id_plan_docente, vigente: true },
            order: [['id', 'DESC']]
        });
        response(res, logros, 'Datos logros.');
    } catch (error) {
        next(error);
    }
};

exports.getAllLogros = async (req, res, next) => { // Revisar esta funcion, tiene errores no obedece los filtros
    try {
        let { limit, offset, search_term = '', id_plan_docente, grado, periodo, anio_lectivo } = req.query;
        const condition = {
            '$plan_docente.anio_lectivo.anio_actual$': anio_lectivo || currentYear,
            descripcion: { [Op.iLike]: `%${ search_term }%` },
            vigente: true
        };
        if (grado) condition['$plan_docente.curso.grado.grado$'] = grado;
        if (periodo) condition['$plan_docente.periodo.numero$'] = periodo;
        if (id_plan_docente && id_plan_docente != '') condition['id_plan_docente'] = id_plan_docente;

        const logros = await Logro.findAndCountAll({
            where: condition,
            include: modelsLogro,
            order: [
                ['id', 'ASC'],
                [ { model: PlanDocente, as: 'plan_docente' }, { model: Curso, as: 'curso' }, { model: Grado, as: 'grado' }, 'grado', 'ASC' ],
                [ { model: PlanDocente, as: 'plan_docente' }, { model: Curso, as: 'curso' }, { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC' ],
                ['descripcion', 'ASC']
            ],
            limit,
            offset
        });
        
        console.log(req.query);

        if (!logros.rows.length == 0) {
            return response(res, logros, 'No hay logros para listar.');
        }
        response(res, logros, 'Datos logros.');
    } catch (error) {
        next(error);
    }
};

exports.bulkCreateLogro = async (req, res, next) => {
    try {
        const logros = req.body;
        // const createdLogros = await LogroDao.bulkCreateLogro(logros);
        const createdLogros = await Logro.bulkCreate(logros, {
            validate: true,
            fields: ['descripcion', 'porcentaje', 'id_plan_docente']
        });
        if (!createdLogros) {
            throw new HttpBadRequest('Hubo un error en el proceso de inserción.');
        }
        response(res, createdLogros, 'Logros creados exitosamente.');
    } catch (error) {
        next(error);
    }
};

exports.updateLogro = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const logros = req.body;
        const listLogros = [];
        let newLogro;

        await Promise.all(logros.map(async (logro) => {
            if (logro.id) {
                [, [newLogro]] = await Logro.update(logro, {
                    where: { id: logro.id },
                    returning: true,
                    transaction
                });
            } else {
                newLogro = await Logro.create(logro, { transaction });
            }
            listLogros.push(newLogro);
        }));

        await transaction.commit();
        response(res, listLogros, 'Logros actualizados.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyLogro = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let { id_logros_to_remove } = req.query;
        id_logros_to_remove = JSON.parse(id_logros_to_remove);
        let count = 0;
        let affectedCount;

        await Promise.all(id_logros_to_remove.map(async (id) => {
            const actividades = await Actividad.findAll({
                where: { id_logro: id },
                transaction
            });
            if (actividades.length == 0) {
                affectedCount = await Logro.destroy({ where: { id }, transaction });
            } else {
                [affectedCount] = await Logro.update({ vigente: false }, {
                    where: { id },
                    returning: true,
                    transaction
                });
            }
            
            if (affectedCount) count++;
        }));
        await transaction.commit();
        response(res, count, `${ count } registro(s) afectado(s).`);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyLogroByPkPlanDocente = async (req, res, next) => {
    try {
        const { id_plan_docente } = req.params;
        const [affectedCount, affectedRows] = await Logro.update({ vigente: false }, {
            where: { id_plan_docente },
            returning: true
        });
        response(res, affectedRows, `${ affectedCount } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};

exports.getNotasActividadesPorLogro = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let { curso } = req.query;
        const { id_logro } = req.params;
        curso = JSON.parse(curso);
        const resumenLogros = [];
        const estudiantes = await Matricula.findAll({
            where: {
                vigente: true,
                '$curso.id_anio_lectivo$': curso.id_anio_lectivo,
                '$curso.id_jornada$': curso.id_jornada,
                '$curso.grado.grado$': curso.grado.grado,
                '$curso.grupo.descripcion$': curso.grupo.descripcion,
                '$estudiante.vigente$': true
            },
            include: modelsMatricula,
            order: [
                [{ model: Estudiante, as: 'estudiante' }, { model: Persona, as: 'persona' }, 'primer_nombre', 'ASC'],
                [{ model: Estudiante, as: 'estudiante' }, { model: Persona, as: 'persona' }, 'primer_apellido', 'ASC']
            ],
            transaction
        });
        const actividades = await Actividad.findAll({
            where: { id_logro },
            order: [['nombre', 'ASC'], ['descripcion', 'ASC']],
            transaction
        });
        
        await Promise.all(estudiantes.map(async (estudiante) => {
            let estudianteLogro = estudiante.estudiante.toJSON(), oneActividad, oneLogro, listActividades = [], total = 0;
            await Promise.all(actividades.map(async (actividad) => {
                const estudianteActividad = await EstudianteActividad.findOne({
                    where: {
                        id_estudiante: estudiante.estudiante.id,
                        id_actividad: actividad.id
                    },
                    transaction
                });
                if (estudianteActividad) {
                    oneActividad = estudianteActividad;
                    total += +estudianteActividad.nota * (actividad.porcentaje / 100);
                } else {
                    oneActividad = {};
                }
                listActividades.push(oneActividad);
            }));

            const notaLogro = await Logro.findByPk(id_logro, { transaction });
            if (notaLogro) {
                oneLogro = notaLogro;
            } else {
                oneLogro = {};
            }
            estudianteLogro.actividades = listActividades;
            estudianteLogro.logro = (+total * (oneLogro.porcentaje / 100)).toFixed(2);
            estudianteLogro.nota = +total.toFixed(2);
            resumenLogros.push(estudianteLogro);
        }));

        await transaction.commit();
        response(res, [resumenLogros, actividades], 'Resumen logro y actividades.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.getNotasPorLogros = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let { curso } = req.query;
        const { id_plan_docente } = req.params;
        const resumenLogros = [];
        curso = JSON.parse(curso);
        const estudiantes = await Matricula.findAll({
            where: {
                vigente: true,
                '$curso.id_anio_lectivo$': curso.id_anio_lectivo,
                '$curso.id_jornada$': curso.id_jornada,
                '$curso.grado.grado$': curso.grado.grado,
                '$curso.grupo.descripcion$': curso.grupo.descripcion,
                '$estudiante.vigente$': true
            },
            include: modelsMatricula,
            order: [
                [{ model: Estudiante, as: 'estudiante' }, { model: Persona, as: 'persona' }, 'primer_nombre', 'ASC'],
                [{ model: Estudiante, as: 'estudiante' }, { model: Persona, as: 'persona' }, 'primer_apellido', 'ASC']
            ],
            transaction
        });
        const logros = await Logro.findAll({
            where: { id_plan_docente },
            order: [['id', 'ASC']], // Antes estaba DESC
            transaction
        });

        await Promise.all(estudiantes.map(async (estudiante) => {
            let estudianteLogro = estudiante.estudiante.toJSON(), oneLogro, listLogros = [], total = 0;
            await Promise.all(logros.map(async (logro) => {
                const estudianteLogro = await EstudianteLogro.findOne({
                    where: {
                        id_estudiante: estudiante.estudiante.id,
                        id_logro: logro.id
                    },
                    transaction
                });
                if (estudianteLogro) {
                    oneLogro = estudianteLogro;
                    total += +estudianteLogro.nota * (logro.porcentaje / 100);
                } else {
                    oneLogro = {};
                }
                listLogros.push(oneLogro);
            }));

            estudianteLogro.logros = listLogros;
            estudianteLogro.nota = +total.toFixed(2);
            resumenLogros.push(estudianteLogro);
        }));

        await transaction.commit();
        response(res, [resumenLogros, logros], 'Resumen por logros');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};