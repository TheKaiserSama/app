const { modelsMatricula } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { sequelize } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Actividad = db.Actividad;
const EstudianteActividad = db.EstudianteActividad;
const EstudianteLogro = db.EstudianteLogro;
const Matricula = db.Matricula;

exports.createEstudianteLogro = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let { curso, id_logro } = req.query, listEstudianteLogro = [];
        let estudianteLogro, created;
        curso = JSON.parse(curso);
        const matriculas = await Matricula.findAll({
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
        const actividades = await Actividad.findAll({
            where: { id_logro },
            order: [['nombre', 'ASC'], ['descripcion', 'ASC']],
            transaction
        });

        await Promise.all(matriculas.map(async (estudiante) => {
            let sum = 0;
            let logro = {
                id_estudiante: estudiante.estudiante.id,
                id_logro: id_logro
            };
            await Promise.all(actividades.map(async (actividad) => {
                const estudianteActividad = await EstudianteActividad.findOne({
                    where: {
                        id_estudiante: estudiante.estudiante.id,
                        id_actividad: actividad.id
                    },
                    transaction: transaction
                });
                if (estudianteActividad) {
                    sum += +estudianteActividad.nota * (actividad.porcentaje / 100);
                }
            }));
            logro.nota = +sum.toFixed(2);
            [estudianteLogro, created] = await EstudianteLogro.findOrCreate({
                where: {
                    id_logro: logro.id_logro,
                    id_estudiante: logro.id_estudiante
                },
                defaults: logro,
                transaction
            });
            if (!created) {
                [, [estudianteLogro]] = await EstudianteLogro.update(logro, {
                    where: { id: estudianteLogro.id },
                    returning: true,
                    transaction
                });
            }
            listEstudianteLogro.push(estudianteLogro);
        }));

        await transaction.commit();
        response(res, listEstudianteLogro, 'Datos de estudiantes.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};