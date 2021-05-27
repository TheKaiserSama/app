const { modelsBoletin, modelsCurso, modelsDocente, modelsEstudiante,modelsGradoMateria, modelsValoracionCualitativa } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { getCurrentYear } = require('../helpers/date');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Actividad = db.Actividad;
const AnioLectivo = db.AnioLectivo;
const Boletin = db.Boletin;
const Curso = db.Curso;
const Docente = db.Docente;
const Estudiante = db.Estudiante;
const EstudianteActividad = db.EstudianteActividad;
const GradoMateria = db.GradoMateria;
const Inasistencia = db.Inasistencia;
const Logro = db.Logro;
const Materia = db.Materia;
const Periodo = db.Periodo;
const PlanDocente = db.PlanDocente;
const ValoracionCualitativa = db.ValoracionCualitativa;
const ValoracionFormativa = db.ValoracionFormativa;
const currentYear = getCurrentYear();

exports.getBoletinesPorPeriodo = async (req, res, next) => {
    try {
        const { id_anio_lectivo, id_curso, id_director_grupo, id_periodo } = req.query;
        const boletinCondition = { id_anio_lectivo, id_curso, id_director_grupo };
        if (id_periodo)
            boletinCondition.id_periodo = id_periodo;
        else
            boletinCondition.id_periodo = { [Op.is]: null };
        
        const boletinesPorPeriodo = await Boletin.findAll({ where: { ...boletinCondition }, include: modelsBoletin });
        response(res, boletinesPorPeriodo, 'Boletínes por periodo.');
    } catch (error) {
        next(error);
    }
};

exports.getValoracionesFormativas = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_boletin } = req.query;
        let results = [];
        
        if (!id_boletin) {
            const valoracionesFormativas = await ValoracionFormativa.findAll({
                where: { vigente: true },
                order: [['descripcion', 'ASC']],
                transaction
            });
            results = valoracionesFormativas.map((valForm) => ({
                nunca: false,
                a_veces: false,
                siempre: false,
                id_valoracion_formativa: valForm.id,
                valoracion_formativa: valForm
            }));
        } else {
            results = await ValoracionCualitativa.findAll({
                where: { id_boletin },
                include: modelsValoracionCualitativa,
                order: [[{ model: ValoracionFormativa, as: 'valoracion_formativa' }, 'descripcion', 'ASC']],
                transaction
            });
        }

        await transaction.commit();
        response(res, results, 'Valoraciones formativas');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.getNotasBoletinPorPeriodo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_estudiante } = req.params;
        const { id_curso, id_grado, id_periodo } = req.query;
        const notasBoletin = await _getNotasBoletinPorPeriodo({ id_curso, id_estudiante, id_grado, id_periodo }, transaction);
        await transaction.commit();
        response(res, notasBoletin, 'Notas de boletín por periodo.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.getNotasBoletinFinal = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_estudiante } = req.params;
        const { id_curso, id_grado } = req.query;
        const notasBoletin = await _getNotasBoletinFinal({ id_curso, id_estudiante, id_grado }, transaction);
        await transaction.commit();
        response(res, notasBoletin, 'Notas boletín final.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.createBoletin = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { info_boletin, info_valoraciones_cualitativas } = req.body;
        const { id_anio_lectivo, id_curso, id_director_grupo, id_estudiante, id_periodo = null } = info_boletin;
        let wasCreated = false;
        const [boletin, created] = await Boletin.findOrCreate({
            where: {
                id_anio_lectivo,
                id_curso,
                id_director_grupo,
                id_estudiante,
                id_periodo
            },
            defaults: info_boletin,
            transaction
        });
        if (created) {
            const valCualitativas = info_valoraciones_cualitativas.map((valCualitativa) => ({ ...valCualitativa, id_boletin: boletin.id }));
            await ValoracionCualitativa.bulkCreate(valCualitativas, { transaction });
            wasCreated = true;
        }

        await transaction.commit();
        response(res, wasCreated, 'Operación efectuada.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.updateBoletin = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_boletin } = req.params;
        const { info_boletin: boletin, info_valoraciones_cualitativas: valoracionesCualitativas } = req.body;
        let affectedRowsCount = 0;

        await Boletin.update(boletin, {
            where: { id: id_boletin },
            returning: true,
            transaction
        });
        await Promise.all(valoracionesCualitativas.map(async (valCualitativa) => {
            [numberOfAffectedRows] = await ValoracionCualitativa.update(valCualitativa, {
                where: { id: valCualitativa.id },
                returning: true,
                transaction
            });
            affectedRowsCount += numberOfAffectedRows;
        }));

        await transaction.commit();
        response(res, { affectedRowsCount }, 'Boletín actualizado.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.deleteBoletin = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_boletin } = req.params;

        await ValoracionCualitativa.destroy({ where: { id_boletin }, transaction });
        const affectedRowsCount = await Boletin.destroy({ where: { id: id_boletin }, transaction });

        await transaction.commit();
        response(res, { affectedRowsCount }, 'Boletín eliminado.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.printOneBoletin = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_estudiante } = req.params;
        const { id_boletin, id_curso, id_docente, id_grado } = req.query;
        const boletin = await Boletin.findByPk(id_boletin, { include: modelsBoletin, transaction });
        const docente = await Docente.findByPk(id_docente, { include: modelsDocente, transaction });
        const estudiante = await Estudiante.findByPk(id_estudiante, { include: modelsEstudiante, transaction });
        const valoracionesCualitativas = await ValoracionCualitativa.findAll({
            where: { id_boletin },
            include: modelsValoracionCualitativa,
            order: [[{ model: ValoracionFormativa, as: 'valoracion_formativa' }, 'descripcion', 'ASC']],
            transaction
        });
        let headerBoletin = {};
        let notasFinales = {};
        const curso = await Curso.findByPk(id_curso, { include: modelsCurso, transaction });
        headerBoletin['anio_lectivo'] = `CURSO ${ curso.grado.grado }° ${ curso.grupo.descripcion } - AÑO LECTIVO ${ curso.anio_lectivo.anio_actual }`;
        headerBoletin['sede'] = `${ curso.sede.nombre }`;
        if ('id_periodo' in req.query) {
            notasFinales = await _getNotasBoletinPorPeriodo({ id_curso, id_estudiante, id_grado, id_periodo: req.query.id_periodo }, transaction);
            const periodo = await Periodo.findByPk(req.query.id_periodo, { transaction });
            headerBoletin['titulo'] = `PERIODO ${ periodo.numero }`;
        } else {
            notasFinales = await _getNotasBoletinFinal({ id_curso, id_estudiante, id_grado }, transaction);
            headerBoletin['titulo'] = `BOLETÍN FINAL`;
        }
        const boletinToPrint = { boletin, docente, estudiante, headerBoletin, notasFinales, valoracionesCualitativas };
        
        await transaction.commit();
        response(res, boletinToPrint, 'Boletín a imprimir.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.printAllBoletin = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let print_boletines = {};
        if ('print_boletines' in req.query)
            print_boletines = JSON.parse(decodeURIComponent(req.query.print_boletines));
        
        const { id, id_curso, id_docente, id_grado } = print_boletines;
        const boletinesToPrint = [];

        await Promise.all(id.map(async ([id_estudiante, id_boletin]) => {
            const boletin = await Boletin.findByPk(id_boletin, { include: modelsBoletin, transaction });
            const docente = await Docente.findByPk(id_docente, { include: modelsDocente, transaction });
            const estudiante = await Estudiante.findByPk(id_estudiante, { include: modelsEstudiante, transaction });
            const valoracionesCualitativas = await ValoracionCualitativa.findAll({
                where: { id_boletin },
                include: modelsValoracionCualitativa,
                order: [[{ model: ValoracionFormativa, as: 'valoracion_formativa' }, 'descripcion', 'ASC']],
                transaction
            });
            let headerBoletin = {};
            let notasFinales = {};
            const curso = await Curso.findByPk(id_curso, { include: modelsCurso, transaction });
            headerBoletin['anio_lectivo'] = `CURSO ${ curso.grado.grado }° ${ curso.grupo.descripcion } - AÑO LECTIVO ${ curso.anio_lectivo.anio_actual }`;
            headerBoletin['sede'] = `${ curso.sede.nombre }`;
            if ('id_periodo' in print_boletines) {
                notasFinales = await _getNotasBoletinPorPeriodo({ id_curso, id_estudiante, id_grado, id_periodo: print_boletines.id_periodo }, transaction);
                const periodo = await Periodo.findByPk(print_boletines.id_periodo, { transaction });
                headerBoletin['titulo'] = `PERIODO ${ periodo.numero }`;
            } else {
                notasFinales = await _getNotasBoletinFinal({ id_curso, id_estudiante, id_grado }, transaction);
                headerBoletin['titulo'] = `BOLETÍN FINAL`;
            }
            const boletinToPrint = { boletin, docente, estudiante, headerBoletin, notasFinales, valoracionesCualitativas };
            boletinesToPrint.push(boletinToPrint);
        }));

        await transaction.commit();
        response(res, boletinesToPrint, 'Boletines para imprimir.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

/*╔════════════════════════════════════════════════════════════════════════════════════════════╗*
                                        Helper Functions                                         
 *╚════════════════════════════════════════════════════════════════════════════════════════════╝*/
const getInasistencias = async (transaction, params = {}) => {
    return [
        await Inasistencia.count({ where: { ...params, justificado: true }, transaction }),
        await Inasistencia.count({ where: { ...params, justificado: false }, transaction })
    ];
};

const getNotaPeriodo = async (logros, transaction, params = {}) => {
    const { id_estudiante } = params;
    let notaPeriodo = 0;
    if (logros.length === 0) notaPeriodo = 1;
    await Promise.all(logros.map(async (logro) => {
        const actividades = await Actividad.findAll({ where: { id_logro: logro.id }, transaction });
        const notaLogro = await getNotaLogro(actividades, transaction, { id_estudiante });
        notaPeriodo += parseFloat(notaLogro) * parseFloat(logro.porcentaje / 100);
    }));
    return notaPeriodo;
};

const getNotaLogro = async (actividades, transaction, params = {}) => {
    const { id_estudiante } = params;
    let notaLogro = 0;
    if (actividades.length === 0) notaLogro = 1;
    await Promise.all(actividades.map(async (actividad) => {
        const notaActividad = await EstudianteActividad.findOne({
            where: { id_estudiante, id_actividad: actividad.id },
            transaction
        });
        if (notaActividad)
            notaLogro += parseFloat(notaActividad.nota) * parseFloat(actividad.porcentaje / 100);
        else
            notaLogro += parseFloat(1.0) * parseFloat(actividad.porcentaje / 100);
    }));
    return notaLogro;
};

const _getNotasBoletinPorPeriodo = async ({ id_curso, id_estudiante, id_grado, id_periodo }, transaction) => {
    const anioLectivo = await AnioLectivo.findOne({ where: { anio_actual: currentYear }, transaction });
    const gradosMateria = await GradoMateria.findAll({
        where: { id_anio_lectivo: anioLectivo.id, id_grado },
        include: modelsGradoMateria,
        order: [[{ model: Materia, as: 'materia' }, 'nombre', 'ASC']],
        transaction
    });
    const materias = gradosMateria.map(gradoMateria => gradoMateria.materia);
    const notasBoletin = materias.map(materia => ({ materia: { ...materia.toJSON() }, faltas: {} }));

    await Promise.all(materias.map(async (materia) => {
        const { id: id_materia } = materia;
        let justificadasCount = 0;
        let sinJustificarCount = 0;
        let notaPeriodo = 0;
        const planDocente = await PlanDocente.findOne({ where: { id_curso, id_periodo, id_materia }, transaction });

        if (planDocente) {
            const { id: id_plan_docente } = planDocente;
            [justificadasCount, sinJustificarCount] = await getInasistencias(transaction, { id_plan_docente, id_estudiante });
            const logros = await Logro.findAll({ where: { id_plan_docente }, transaction });
            notaPeriodo = await getNotaPeriodo(logros, transaction, { id_estudiante });
        } else
            notaPeriodo = 1;
        
        const index = notasBoletin.findIndex(({ materia }) => materia.id === id_materia);
        notasBoletin[index].nota_final = notaPeriodo;
        notasBoletin[index].faltas.justificadas = justificadasCount;
        notasBoletin[index].faltas.sin_justificar = sinJustificarCount;
    }));

    return notasBoletin;
};

const _getNotasBoletinFinal = async ({ id_curso, id_estudiante, id_grado }, transaction) => {
    const anioLectivo = await AnioLectivo.findOne({ where: { anio_actual: currentYear }, transaction });
    const { id: id_anio_lectivo } = anioLectivo;
    const periodos = await Periodo.findAll({ where: { id_anio_lectivo }, transaction });
    const PERIODOS_COUNT = periodos.length;
    const gradosMateria = await GradoMateria.findAll({
        where: { id_anio_lectivo, id_grado },
        include: modelsGradoMateria,
        order: [[{ model: Materia, as: 'materia' }, 'nombre', 'ASC']],
        transaction
    });
    const materias = gradosMateria.map(gradoMateria => gradoMateria.materia);
    const notasBoletin = materias.map(materia => ({ materia: { ...materia.toJSON() }, faltas: {} }));

    await Promise.all(materias.map(async (materia) => {
        const { id: id_materia } = materia;
        let justificadasCount = 0;
        let sinJustificarCount = 0;
        let notaFinal = 0;

        await Promise.all(periodos.map(async (periodo) => {
            const { id: id_periodo } = periodo;
            let notaPeriodo = 0;
            const planDocente = await PlanDocente.findOne({ where: { id_curso, id_periodo, id_materia }, transaction });
            
            if (planDocente) {
                const { id: id_plan_docente } = planDocente;
                [faltasJustificadas, faltasSinJustificar] = await getInasistencias(transaction, { id_plan_docente, id_estudiante });
                justificadasCount += faltasJustificadas;
                sinJustificarCount += faltasSinJustificar;

                const logros = await Logro.findAll({ where: { id_plan_docente: planDocente.id }, transaction });
                notaPeriodo = await getNotaPeriodo(logros, transaction, { id_estudiante });
            } else
                notaPeriodo = 1;
            notaFinal += parseFloat(notaPeriodo);
        }));
        const index = notasBoletin.findIndex(({ materia }) => materia.id === id_materia);
        notasBoletin[index].nota_final = parseFloat(notaFinal / PERIODOS_COUNT);
        notasBoletin[index].faltas.justificadas = justificadasCount;
        notasBoletin[index].faltas.sin_justificar = sinJustificarCount;
    }));
    return notasBoletin;
};