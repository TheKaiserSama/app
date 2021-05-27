const { modelsGradoMateria, modelsMatricula } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { getCurrentYear } = require('../helpers/date');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Actividad = db.Actividad;
const AnioLectivo = db.AnioLectivo;
const Consolidado = db.Consolidado;
const ConsolidadoEstudiante = db.ConsolidadoEstudiante;
const Estudiante = db.Estudiante;
const EstudianteActividad = db.EstudianteActividad;
const GradoMateria = db.GradoMateria;
const Inasistencia = db.Inasistencia;
const Logro = db.Logro;
const Periodo = db.Periodo;
const Persona = db.Persona;
const Materia = db.Materia;
const Matricula = db.Matricula;
const PlanDocente = db.PlanDocente;
const currentYear = getCurrentYear();

exports.getConsolidadoPorPeriodo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_anio_lectivo, id_curso, id_director_grupo, id_grado, id_periodo } = req.query;
        const matriculas = await getMatriculas(id_curso, transaction);
        const encabezados = await getEncabezados(id_grado, transaction);
        const consolidado = await getConsolidado({ id_anio_lectivo, id_curso, id_director_grupo, id_periodo }, transaction);
        const notasEstudiantes = [];
        let consolidadoEstudiantes = [];
        if (consolidado && consolidado.id)
            consolidadoEstudiantes = await ConsolidadoEstudiante.findAll({ where: { id_consolidado: consolidado.id }, transaction });
        else
            consolidadoEstudiantes = matriculas.map(({ id_estudiante }) => ({ observaciones: '', id_consolidado: null, id_estudiante }));

        await Promise.all(matriculas.map(async ({ estudiante }) => {
            const notasEstudiante = await _getNotasConsolidadoPorPeriodo({ id_curso, id_estudiante: estudiante.id, id_grado, id_periodo }, transaction);
            const faltasTotales = { justificadas: 0, sin_justificar: 0 };
            notasEstudiante.forEach(notaEstudiante => {
                faltasTotales.justificadas += notaEstudiante.faltas.justificadas;
                faltasTotales.sin_justificar += notaEstudiante.faltas.sin_justificar;
            })
            notasEstudiantes.push({ estudiante, faltas_totales: faltasTotales, notas: notasEstudiante });
        }));

        await transaction.commit();
        response(
            res,
            { consolidado, consolidado_estudiantes: consolidadoEstudiantes, encabezados, notas_estudiantes: notasEstudiantes },
            'Consolidado por periodo.'
        );
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.getConsolidadoFinal = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_anio_lectivo, id_curso, id_director_grupo, id_grado } = req.query;
        const matriculas = await getMatriculas(id_curso, transaction);
        const encabezados = await getEncabezados(id_grado, transaction);
        const consolidado = await getConsolidado({ id_anio_lectivo, id_curso, id_director_grupo }, transaction);
        const notasEstudiantes = [];
        let consolidadoEstudiantes = [];
        if (consolidado && consolidado.id)
            consolidadoEstudiantes = await ConsolidadoEstudiante.findAll({ where: { id_consolidado: consolidado.id }, transaction });
        else
            consolidadoEstudiantes = matriculas.map(({ id_estudiante }) => ({ observaciones: '', id_consolidado: null, id_estudiante }));
        
        await Promise.all(matriculas.map(async ({ estudiante }) => {
            const notasEstudiante = await _getNotasConsolidadoFinal({ id_curso, id_estudiante: estudiante.id, id_grado }, transaction);
            const faltasTotales = { justificadas: 0, sin_justificar: 0 };
            notasEstudiante.forEach(notaEstudiante => {
                faltasTotales.justificadas += notaEstudiante.faltas.justificadas;
                faltasTotales.sin_justificar += notaEstudiante.faltas.sin_justificar;
            })
            notasEstudiantes.push({ estudiante, faltas_totales: faltasTotales, notas: notasEstudiante });
        }));

        await transaction.commit();
        response(
            res,
            { consolidado, consolidado_estudiantes: consolidadoEstudiantes, encabezados, notas_estudiantes: notasEstudiantes },
            'Consolidado final.'
        );
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.createConsolidado = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { info_consolidado, info_consolidados_estudiantes } = req.body;
        const { id_anio_lectivo, id_curso, id_director_grupo, id_periodo = null } = info_consolidado;
        let wasCreated = false;
        const [consolidado, created] = await Consolidado.findOrCreate({
            where: {
                id_anio_lectivo,
                id_curso,
                id_director_grupo,
                id_periodo
            },
            defaults: info_consolidado,
            transaction
        });
        if (created) {
            const conEstudiantes = info_consolidados_estudiantes
            .map((conEstudiantes) => ({ ...conEstudiantes, id_consolidado: consolidado.id }));
            await ConsolidadoEstudiante.bulkCreate(conEstudiantes, { transaction });
            wasCreated = true;
        }
        await transaction.commit();
        response(res, wasCreated, 'Operación realizada.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.updateConsolidado = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { id_consolidado } = req.params;
        const {
            info_consolidado: consolidado,
            info_consolidados_estudiantes: consolidadosEstudiantes
        } = req.body;
        let affectedRowsCount = 0;

        await Consolidado.update(consolidado, {
            where: { id: id_consolidado },
            returning: true,
            transaction
        });
        await Promise.all(consolidadosEstudiantes.map(async (conEstudiante) => {
            [numberOfAffectedRows] = await ConsolidadoEstudiante.update(conEstudiante, {
                where: { id: conEstudiante.id },
                returning: true,
                transaction
            });
            affectedRowsCount += numberOfAffectedRows;
        }));

        await transaction.commit();
        response(res, { affectedRowsCount }, 'Consolidado actualizado.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

/*╔════════════════════════════════════════════════════════════════════════════════════════════╗*
                                        Helper Functions                                         
 *╚════════════════════════════════════════════════════════════════════════════════════════════╝*/

const _getNotasConsolidadoPorPeriodo = async ({ id_curso, id_estudiante, id_grado, id_periodo }, transaction) => {
    const gradosMateria = await getGradoMateria(id_grado, transaction);
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

const _getNotasConsolidadoFinal = async ({ id_curso, id_estudiante, id_grado }, transaction) => {
    const anioLectivo = await AnioLectivo.findOne({ where: { anio_actual: currentYear }, transaction });
    const { id: id_anio_lectivo } = anioLectivo;
    const periodos = await Periodo.findAll({ where: { id_anio_lectivo }, transaction });
    const PERIODOS_COUNT = periodos.length;
    const gradosMateria = await getGradoMateria(id_grado, transaction);
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

const getMatriculas = async (id_curso, transaction) => {
    return await Matricula.findAll({
        where: { id_curso },
        include: modelsMatricula,
        order: [
            [{ model: Estudiante, as: 'estudiante' }, { model: Persona, as: 'persona' }, 'primer_nombre', 'ASC'],
            [{ model: Estudiante, as: 'estudiante' }, { model: Persona, as: 'persona' }, 'primer_apellido', 'ASC']
        ],
        transaction
    });
};

const getGradoMateria = async (id_grado, transaction) => {
    const anioLectivo = await AnioLectivo.findOne({ where: { anio_actual: currentYear }, transaction });
    return await GradoMateria.findAll({
        where: { id_anio_lectivo: anioLectivo.id, id_grado },
        include: modelsGradoMateria,
        order: [[{ model: Materia, as: 'materia' }, 'nombre', 'ASC']],
        transaction
    });
}

const getEncabezados = async (id_grado, transaction) => {
    const gradosMateria = await getGradoMateria(id_grado, transaction);
    const encabezados = gradosMateria.map(({ materia }) => 
    ({ nombre: materia.nombre.toUpperCase(), abreviatura: getNombreAbreviado(materia.nombre) }));
    encabezados.push({ nombre: 'FALTAS JUSTIFICADAS', abreviatura: 'F. J.' });
    encabezados.push({ nombre: 'FALTAS SIN JUSTIFICAR', abreviatura: 'F. S. J.' });
    encabezados.push({ nombre: 'OBSERVACIONES', abreviatura: 'OBSER.' });
    return encabezados;
};

const getNombreAbreviado = (nombre) => {
    return nombre
        .split(' ')
        .filter(nombre => nombre.length > 3)
        .map(nombre => `${ nombre.slice(0, 4) }.`)
        .join(' ')
        .toUpperCase();
};

const getConsolidado = async ({ id_anio_lectivo, id_curso, id_director_grupo, id_periodo }, transaction) => {
    let consolidado;
    const consolidadoCondition = { id_anio_lectivo, id_curso, id_director_grupo };
    if (!id_periodo)
        consolidadoCondition['id_periodo'] = { [Op.is]: null };
    else
        consolidadoCondition['id_periodo'] = id_periodo;
    
    consolidado = await Consolidado.findOne({ where: { ...consolidadoCondition }, transaction });
    if (!consolidado) {
        consolidado = {
            rector: '',
            coordinador: '',
            id_anio_lectivo: +id_anio_lectivo,
            id_curso: +id_curso,
            id_director_grupo: +id_director_grupo,
            id_periodo: +id_periodo || null
        };
    }
    return consolidado;
};