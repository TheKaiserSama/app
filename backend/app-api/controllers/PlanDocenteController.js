const { modelsPlanDocente, modelsMatricula, modelsGradoMateria, modelsEstudiante } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { formatDate, getCurrentDate } = require('../helpers/date');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const Area = db.Area;
const Curso = db.Curso;
const Estudiante = db.Estudiante;
const EstudianteLogro = db.EstudianteLogro;
const Grado = db.Grado;
const GradoMateria = db.GradoMateria;
const Grupo = db.Grupo;
const Logro = db.Logro;
const Materia = db.Materia;
const Matricula = db.Matricula;
const Periodo = db.Periodo;
const PlanDocente = db.PlanDocente;
const PlanEstudiante = db.PlanEstudiante;
const currentDate = getCurrentDate();

exports.getByPkPlanDocente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const planDocente = await PlanDocente.findByPk(id, {
            include: modelsPlanDocente
        });
        if (!planDocente) {
            throw new HttpNotFound(`Carga académica docente con id=${ id } no encontrada.`);
        }
        response(res, planDocente, 'Carga académica docente.');
    } catch (error) {
        next(error);
    }
};

exports.getAllPlanesDocente = async (req, res, next) => {
    try {
        const { limit, offset, search_term = '', id_docente, id_anio_lectivo, id_curso, id_periodo } = req.query;
        let message = 'Cargas académicas docente.';
        const condition = {
            // vigente: true,
            id_docente,
            [Op.or]: [
                { '$materia.nombre$': { [Op.iLike]: `%${ search_term }%` } },
                { '$materia.area.nombre$': { [Op.iLike]: `%${ search_term }%` } }
            ]
        };
        if (id_anio_lectivo) condition.id_anio_lectivo = id_anio_lectivo;
        if (id_curso) condition.id_curso = id_curso;
        if (id_periodo) condition.id_periodo = id_periodo;

        const planDocentes = await PlanDocente.findAndCountAll({
            where: condition,
            include: modelsPlanDocente,
            order: [
                [{ model: Materia, as: 'materia' }, { model: Area, as: 'area' }, 'nombre', 'ASC'],
                [{ model: Materia, as: 'materia' }, 'nombre', 'ASC'],
                [{ model: Curso, as: 'curso' }, { model: Grado, as: 'grado' }, 'grado', 'ASC'],
                [{ model: Curso, as: 'curso' }, { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC'],
                [{ model: AnioLectivo, as: 'anio_lectivo' }, 'anio_actual', 'DESC'],
                [{ model: Periodo, as: 'periodo' }, 'numero', 'ASC']
            ],
            limit,
            offset
        });

        if (planDocentes.rows.length === 0) {
            message = 'No hay cargas académicas docente para listar.';
        }
        response(res, planDocentes, message);
    } catch (error) {
        next(error);
    }
};

exports.getPlanDocentePorCurso = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_curso } = req.params;
        const { id_anio_lectivo, id_grado, id_persona } = req.query;
        const results = [];
        let message = 'Cargas académicas docentes';

        const materiasPorGrado = await GradoMateria.findAll({
            where: {
                id_anio_lectivo,
                id_grado
            },
            include: modelsGradoMateria,
            transaction
        });
        const estudiante = await Estudiante.findOne({
            where: { id_persona },
            include: modelsEstudiante,
            transaction
        });
        const numeroPeriodos = await Periodo.findAll({
            where: { id_anio_lectivo },
            order: [['numero', 'ASC']]
        });

        if (materiasPorGrado) {
            await Promise.all(materiasPorGrado.map(async (materiaPorGrado) => {
                const objLogros = {};
                objLogros.materia = materiaPorGrado.materia.nombre;
                objLogros.longitud = 1;
                const planesDocente = await PlanDocente.findAll({
                    where: {
                        id_materia: materiaPorGrado.id_materia,
                        id_curso
                    },
                    include: modelsPlanDocente,
                    order: [
                        [{ model: Periodo, as: 'periodo' }, 'numero', 'ASC']
                    ],
                    transaction
                });

                if (planesDocente.length > 0) {
                    await Promise.all(planesDocente.map(async (planDocente, i) => {
                        const arrayLogros = [];
                        const logros = await Logro.findAll({
                            where: { id_plan_docente: planDocente.id },
                            order: [['id', 'ASC']],
                            transaction
                        });

                        if (logros.length > objLogros.longitud) {
                            objLogros.longitud = logros.length;
                        }
                        
                        if (logros.length > 0) {
                            await Promise.all(logros.map(async (logro) => {
                                const copyLogro = JSON.parse(JSON.stringify(logro));
                                const _logro = await EstudianteLogro.findOne({
                                    where: {
                                        id_estudiante: estudiante.id,
                                        id_logro: logro.id,
                                    },
                                    transaction
                                });
                                _logro ? copyLogro.nota = _logro.nota : copyLogro.nota = null;
                                arrayLogros.push(copyLogro);
                            }));
                        }
                        
                        objLogros[`logros_periodo_${ i + 1 }`] = arrayLogros || [];
                    }));
                } else {
                    numeroPeriodos.map((periodo, i) => objLogros[`logros_periodo_${ i + 1 }`] = []);
                }
                results.push(objLogros);
            }));
        }
        await transaction.commit();
        response(res, results, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.getCursosPorDocente = async (req, res, next) => {
    try {
        const { id_docente } = req.params;
        const { id_anio_lectivo } = req.query;
        const cursosPorDocente = await PlanDocente.findAll({
            where: { id_docente, id_anio_lectivo },
            include: modelsPlanDocente
        });
        
        const results = cursosPorDocente.filter((plan_docente, index, array) => array.findIndex(t => (t.id_curso === plan_docente.id_curso)) === index);
        const cursos = results.map(plan_docente => plan_docente.curso);
        response(res, cursos, 'Cursos por docente.');
    } catch (error) {
        next(error);
    }
};

exports.getMateriasDocente = async (req, res, next) => {
    try {
        const { id_docente } = req.params;
        const { id_anio_lectivo, id_curso, id_materia } = req.query;
        const condition = { id_docente };
        if (id_anio_lectivo) condition.id_anio_lectivo = id_anio_lectivo;
        if (id_curso) condition.id_curso = id_curso;
        if (id_materia) condition.id_materia = id_materia;
        const materiasDocente = await PlanDocente.findAll({
            where: condition,
            include: modelsPlanDocente
        });
        const results = materiasDocente.filter((plan_docente, index, array) => array.findIndex(t => (t.id_materia === plan_docente.id_materia)) === index);
        const materias = results.map(plan_docente => plan_docente.materia);
        response(res, materias, 'Materias por docente.');
    } catch (error) {
        next(error);
    }
};

exports.getCursosPorPeriodo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_docente, anio_actual, fecha_inicio, fecha_finalizacion } = req.query;
        const anioLectivo = await AnioLectivo.findOne({
            where: { anio_actual },
            transaction
        });        
        const condition = {};
        if (id_docente) condition.id_docente = id_docente;
        if (anioLectivo) condition.id_anio_lectivo = anioLectivo.id;
        if (fecha_inicio) condition['$periodo.fecha_inicio$'] = { [Op.lte]: currentDate };
        if (fecha_finalizacion) condition['$periodo.fecha_finalizacion$'] = { [Op.gte]: currentDate };
        const planesDocente = await PlanDocente.findAll({
            where: condition,
            include: modelsPlanDocente,
            transaction
        });
        await transaction.commit();
        response(res, planesDocente, 'Planes docente...');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.findOrCreatePlanDocente = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let message = 'Carga académica docente creada exitosamente.';
        const { fecha_registro, fecha_ingreso, id_materia, id_anio_lectivo, id_sede, id_docente, curso, periodo } = req.body, listPlanDocente = [];
        
        const newPlanDocente = {
            fecha_registro: formatDate(fecha_registro),
            fecha_ingreso: formatDate(fecha_ingreso),
            id_materia: id_materia,
            id_anio_lectivo: id_anio_lectivo,
            id_sede: id_sede,
            id_docente: id_docente,
            id_curso: curso.id
        };

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
            transaction
        });

        await Promise.all(periodo.map(async (periodo) => {
            const copyPlanDocente = {
                ...newPlanDocente,
                id_periodo: periodo.id,
                fecha_ingreso: periodo.fecha_inicio
            };
            const [createdPlanDocente, created] = await PlanDocente.findOrCreate({
                where: {
                    id_curso: copyPlanDocente.id_curso,
                    id_materia: copyPlanDocente.id_materia,
                    id_periodo: copyPlanDocente.id_periodo,
                    id_anio_lectivo: copyPlanDocente.id_anio_lectivo
                },
                defaults: copyPlanDocente,
                transaction
            });
            
            if (!created) return;
            listPlanDocente.push(createdPlanDocente);
            await Promise.all(estudiantes.map(async (estudiante) => {
                const newEstudiante = {
                    fecha_registro: formatDate(getCurrentDate()),
                    id_plan_docente: createdPlanDocente.id,
                    id_estudiante: estudiante.estudiante.id
                };
                await PlanEstudiante.create(newEstudiante, { transaction });
            }));
        }));
        await transaction.commit();
        response(res, listPlanDocente, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.updatePlanDocente = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id } = req.params;
        const planDocente = req.body;
        const { curso: { grado, grupo } } = planDocente;
        planDocente.fecha_registro = formatDate(planDocente.fecha_registro);
        planDocente.fecha_ingreso = formatDate(planDocente.fecha_ingreso);

        // const curso = await CursoDao.findOneCursoByGradoGrupo(gradoGrupo.id, transaction); // Esta Función no existe
        planDocente.id_curso = curso.id;
        const [affectedCount, affectedRows] = await PlanDocente.update(planDocente, {
            where: { id },
            returning: true,
            transaction
        });
        await transaction.commit();
        response(res, { affectedCount, affectedRows }, `${ affectedCount } registro(s) afectado(s).`);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyPlanDocente = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id } = req.params;
        let affectedRows = 0;
        const estudiantes = await PlanEstudiante.findAll({
            where: { id_plan_docente: id },
            transaction
        });
        if (estudiantes) {
            await Promise.all(estudiantes.map(async (estudiante) => {
                await PlanEstudiante.destroy({
                    where: {id: estudiante.id},
                    transaction
                });
            }));
            affectedRows = await PlanDocente.destroy({
                where: { id },
                transaction
            });
        }
        await transaction.commit();
        response(res, { affectedRows }, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};