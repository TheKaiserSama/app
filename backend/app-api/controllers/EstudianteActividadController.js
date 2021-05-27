const { modelsEstudianteActividad, modelsActividad, modelsPlanDocente, modelsNotificacion, modelsEstudiante } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { sequelize, sequelize: { QueryTypes } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Actividad = db.Actividad;
const Estudiante = db.Estudiante;
const EstudianteActividad = db.EstudianteActividad;
const Notificacion = db.Notificacion;
const PlanDocente = db.PlanDocente;

exports.getOneEstudianteActividad = async (req, res, next) => {
    try {
        const { id_estudiante, id_actividad } = req.params;
        let message = 'Datos nota de actividad.';
        const notaActividad = await EstudianteActividad.findOne({
            where: { id_estudiante, id_actividad },
            include: modelsEstudianteActividad
        });
        if (!notaActividad) {
            message = 'Nota de actividad no encontrada.';
        }
        response(res, notaActividad, message);
    } catch (error) {
        next(error);
    }
};

exports.getNotasMasAltas = async (req, res, next) => {
    try {
        const { id_actividad } = req.query;
        const queryNotasMasAltas = getQueryNotasMasAltas(id_actividad);
        const notasMaximas = await sequelize.query(queryNotasMasAltas, {
            type: QueryTypes.SELECT
        });
        const results = await getNotas(notasMaximas);
        response(res, results, 'Estudiantes con notas más altas.');
    } catch (error) {
        next(error);
    }
};

exports.getNotasMasBajas = async (req, res, next) => {
    try {
        const { id_actividad } = req.query;
        const queryNotasMasBajas = getQueryNotasMasBajas(id_actividad);
        const notasMinimas = await sequelize.query(queryNotasMasBajas, {
            type: QueryTypes.SELECT
        });
        const results = await getNotas(notasMinimas);
        response(res, results, 'Estudiantes con notas más bajas.');
    } catch (error) {
        next(error);
    }
};

exports.getNotaPromedio = async (req, res, next) => {
    try {
        const { id_actividad } = req.query;
        const [notaPromedio] = await EstudianteActividad.findAll({
            where: { id_actividad },
            attributes: [
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('nota')), '2'), 'promedio']
            ],
        });
        response(res, notaPromedio, 'Nota promedio.');
    } catch (error) {
        next(error);
    }
};

exports.findOrCreateEstudianteActividad = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { persona, notas: estudiantesActividad } = req.body;
        const listNotaActividad = [];
        const [ actividad ] = estudiantesActividad;
        let created;
        
        const infoActividad = await Actividad.findByPk(actividad.id_actividad, {
            include: modelsActividad,
            transaction
        });
        const { id_plan_docente } = infoActividad.logro;
        const infoPlanDocente = await PlanDocente.findByPk(id_plan_docente, {
            include: modelsPlanDocente,
            transaction
        });
        
        await Promise.all(estudiantesActividad.map(async (estudianteActividad) => {
            let notaActividad;
            const newNotaActividad = {
                nota: estudianteActividad.nota,
                id_actividad: estudianteActividad.id_actividad,
                id_estudiante: estudianteActividad.id_estudiante
            };
            [notaActividad, created] = await EstudianteActividad.findOrCreate({
                where: {
                    id_actividad: newNotaActividad.id_actividad,
                    id_estudiante: newNotaActividad.id_estudiante
                },
                defaults: newNotaActividad,
                transaction
            });
            if (!created) {
                [, [notaActividad]] = await EstudianteActividad.update(estudianteActividad, {
                    where: { id: notaActividad.id },
                    returning: true,
                    transaction
                });
            }

            if (notaActividad) {
                const notificacion = {
                    mensaje: `${ persona.primer_nombre } ${ persona.segundo_nombre } calificó la actividad ${ infoActividad.nombre }`,
                    id_tipo_notificacion: 1,
                    id_estudiante: estudianteActividad.id_estudiante,
                    id_plan_docente: infoPlanDocente.id,
                    id_actividad: actividad.id_actividad
                };
                const existeNotificacion = await Notificacion.findOne({
                    where: {
                        mensaje: notificacion.mensaje,
                        id_estudiante: notificacion.id_estudiante,
                        id_plan_docente: notificacion.id_plan_docente
                    },
                    include: modelsNotificacion,
                    transaction
                });
                if (!existeNotificacion) {
                    await Notificacion.create(notificacion);
                }

                // Dejar esta linea aqui o borrarla y descomentar la siguiente (misma instrucción)
                // listNotaActividad.push(notaActividad);
                // console.log(JSON.parse(JSON.stringify(notaActividad)));
                listNotaActividad.push(notaActividad);
            }
        }));

        const queryNotasMasAltas = getQueryNotasMasAltas(actividad.id_actividad);
        const notasMaximas = await sequelize.query(queryNotasMasAltas, {
            type: QueryTypes.SELECT,
            transaction
        });
        const queryNotasMasBajas = getQueryNotasMasBajas(actividad.id_actividad);
        const notasMinimas = await sequelize.query(queryNotasMasBajas, {
            type: QueryTypes.SELECT,
            transaction
        });
        const [notaPromedio] = await EstudianteActividad.findAll({
            where: { id_actividad: actividad.id_actividad },
            attributes: [
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('nota')), '2'), 'promedio']
            ],
            transaction
        });

        const notasResult = {
            notas: listNotaActividad,
            notasMaximas: await getNotas(notasMaximas, transaction),
            notasMinimas: await getNotas(notasMinimas, transaction),
            notaPromedio: notaPromedio
        };

        await transaction.commit();
        response(res, notasResult, 'Notas guardadas exitosamente.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.createEstudianteActividad = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const estudiantesActividad = req.body;
        const listNotaActividad = [];
        
        await Promise.all(estudiantesActividad.map(async (estudianteActividad) => {
            const newNotaActividad = {
                nota: estudianteActividad.nota,
                id_actividad: estudianteActividad.id_actividad,
                id_estudiante: estudianteActividad.id_estudiante
            };
            const notaActividad = await EstudianteActividad.create(newNotaActividad, {
                transaction
            });
            listNotaActividad.push(notaActividad);
        }))

        await transaction.commit();
        response(res, listNotaActividad, 'Notas guardadas exitosamente.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

/*╔════════════════════════════════════════════════════════════════════════════════════════════╗*
                                        Helper Functions                                         
 *╚════════════════════════════════════════════════════════════════════════════════════════════╝*/
const getNotas = async (notas, transaction = null) => {
    const arrayNotas = []; 
    await Promise.all(notas.map(async (nota) => {
        const results = await Estudiante.findByPk(nota.id_estudiante, {
            include: modelsEstudiante,
            transaction
        });
        infoEstudiante = results.toJSON();
        infoEstudiante.nota = nota;
        arrayNotas.push(infoEstudiante);
    }));
    return arrayNotas;
};

const getQueryNotasMasAltas = (id_actividad) => {
    return `
        SELECT id, id_actividad, id_estudiante, nota
        FROM "estudiante_actividad" WHERE id_actividad = ${ id_actividad } AND 
        nota = (SELECT MAX(nota) FROM "estudiante_actividad" WHERE id_actividad = ${ id_actividad });
    `;
};

const getQueryNotasMasBajas = (id_actividad) => {
    return `
        SELECT id, id_actividad, id_estudiante, nota
        FROM "estudiante_actividad" WHERE id_actividad = ${ id_actividad } AND 
        nota = (SELECT MIN(nota) FROM "estudiante_actividad" WHERE id_actividad = ${ id_actividad });
    `;
};