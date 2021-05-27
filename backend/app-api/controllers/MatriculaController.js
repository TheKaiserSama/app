const bcrypt = require('bcryptjs');
const { modelsMatricula, modelsPlanDocente, modelsPlanEstudiante } = require('../helpers/includeModels');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { formatDate, getCurrentDate, getCurrentYear } = require('../helpers/date');
const { ROL } = require('../helpers/const');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const Curso = db.Curso;
const Estudiante = db.Estudiante;
const Persona = db.Persona;
const Matricula = db.Matricula;
const PlanDocente = db.PlanDocente;
const PlanEstudiante = db.PlanEstudiante;
const Sede = db.Sede;
const Usuario = db.Usuario;
const currentDate = getCurrentDate();
const currentYear = getCurrentYear();

exports.getByPkMatricula = async (req, res, next) => {
    try {
        const { id } = req.params;
        const matricula = await Matricula.findByPk(id, { include: modelsMatricula });
        if (!matricula) {
            throw new HttpNotFound(`Matricula con id=${ id } no encontrada.`);
        }
        response(res, matricula, 'Datos matricula.');
    } catch (error) {
        next(error);
    }
};

exports.getMatriculasPorEstudiante = async (req, res, next) => {
    try {
        const { id_estudiante } = req.params;
        let message = 'Datos matriculas.';
        const matriculas = await Matricula.findAll({
            where: { id_estudiante, vigente: true },
            include: modelsMatricula
        });
        if (!matriculas) {
            message = `No hay matriculas para el estudiante con id=${ id_estudiante }.`;
        }
        response(res, matriculas, message);
    } catch (error) {
        next(error);
    }
};

exports.getAllMatriculas = async (req, res, next) => { // cambiar anio_lectivo por id_anio_lectivo
    try {
        let { limit, offset, search_term = '', vigente, id_anio_lectivo, id_grado, id_grupo } = req.query;
        let message = 'Datos matriculas.';
        vigente = vigente.toLowerCase() == 'true' ? true : false;
        const condition = {
            [Op.or]: [
                { '$estudiante.persona.primer_nombre$': { [Op.iLike]: `%${ search_term }%` } },
                { '$estudiante.persona.primer_apellido$': { [Op.iLike]: `%${ search_term }%` } },
                { '$estudiante.persona.documento$': { [Op.iLike]: `%${ search_term }%` } }
            ],
            // '$anio_lectivo.anio_actual$': anio_lectivo,
            vigente
        };
        if (id_anio_lectivo) condition['id_anio_lectivo'] = id_anio_lectivo;
        if (id_grado) condition['$curso.grado.id$'] = id_grado;
        if (id_grupo) condition['$curso.grupo.id$'] = id_grupo;

        const matriculas = await Matricula.findAndCountAll({
            where: condition,
            include: modelsMatricula,
            order: [['id', 'DESC']],
            limit,
            offset
        });
        if (matriculas.rows.length === 0) {
            message = 'No hay matriculas para listar.';
        }
        response(res, matriculas, message);
    } catch (error) {
        next(error);
    }
};

exports.getMatriculasPorCurso = async (req, res, next) => {
    try {
        const { id_curso } = req.params;
        const matriculas = await Matricula.findAll({
            where: { id_curso, vigente: true },
            include: modelsMatricula
        });
        response(res, matriculas, 'Lista de matriculas.');
    } catch (error) {
        next(error);
    }
};

exports.getCountMatriculasPorSede = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const matriculasPorSede = [];
        const countSedes = await Sede.findAll({ transaction });
        const anioActual = await AnioLectivo.findOne({
            where: { anio_actual: currentYear },
            transaction
        });
        await Promise.all(countSedes.map(async (sede) => {
            const cantidad_matriculas = await Matricula.count({
                where: { '$curso.id_sede$': sede.id, id_anio_lectivo: anioActual.id },
                include: modelsMatricula,
                transaction
            });
            const matriculaPorSede = {
                nombre: sede.nombre,
                cantidad_matriculas
            };
            matriculasPorSede.push(matriculaPorSede);
        }));
        await transaction.commit();
        response(res, matriculasPorSede, 'Matriculas por sede.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.getCountMatriculasUltimosAnios = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const matriculasUltimosAnios = [];
        const ultimosAnios = [
            currentYear - 2,
            currentYear - 1,
            currentYear
        ];
        await Promise.all(ultimosAnios.map(async (anio) => {
            const anioLectivo = await AnioLectivo.findOne({
                where: { anio_actual: anio },
                transaction
            });
            let matriculasPorAnio = 0;
            if (anioLectivo) {
                matriculasPorAnio = await Matricula.count({
                    where: { id_anio_lectivo: anioLectivo.id },
                    transaction
                });
            }
            matriculasUltimosAnios.push(matriculasPorAnio);
        }));
        await transaction.commit();
        response(res, matriculasUltimosAnios, 'Estudiantes matriculados en los ultimos 3 años.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.createMatricula = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { acudiente, matricula  } = req.body;
        const { estado_matricula, curso, estudiante: info_estudiante } = matricula;
        const { persona: estudiante, estado_estudiante } = info_estudiante;
        
        // Crear acudiente(persona) o actualizarlo si existe.
        const datosAcudiente = getDatosPersona(acudiente);
        const [resultAcudiente, createdAcudiente] = await Persona.findOrCreate({
            where: { documento: datosAcudiente.documento },
            defaults: datosAcudiente,
            transaction
        });
        if (!createdAcudiente) {
            await Persona.update(datosAcudiente, {
                where: { id: resultAcudiente.id },
                transaction
            });
        }
        
        // Crear estudiante(persona) o actualizarlo si existe.
        const datosEstudiante = getDatosPersona(estudiante);
        const [resultPersona, createdPersona] = await Persona.findOrCreate({
            where: { documento: datosEstudiante.documento },
            defaults: datosEstudiante,
            transaction
        });
        if (!createdPersona) {
            await Persona.update(datosEstudiante, {
                where: { id: resultPersona.id },
                transaction
            });
        }

        // Creando al estudiante.
        const infoEstudiante = getDatosEstudiante(info_estudiante, resultAcudiente, resultPersona, estado_estudiante);
        const [resultEstudiante] = await Estudiante.findOrCreate({
            where: { id_persona: infoEstudiante.id_persona },
            defaults: infoEstudiante,
            transaction
        });

        // Creando la cuenta del estudiante.
        const usuario = getDatosUsuario(estudiante, resultPersona);
        await Usuario.findOrCreate({
            where: { username: usuario.username },
            defaults: usuario,
            transaction
        });

        // Creando la matricula del estudiante.
        const datosMatricula = getDatosMatricula(matricula, curso, resultEstudiante, estado_matricula);
        const [createdMatricula, created] = await Matricula.findOrCreate({
            where: {
                id_estudiante: datosMatricula.id_estudiante,
                id_anio_lectivo: datosMatricula.id_anio_lectivo,
                id_curso: datosMatricula.id_curso
            },
            defaults: datosMatricula,
            transaction
        });

        // Actualizando el cupo utilizado del curso
        if (created) {
            await Curso.update(
                { cupo_utilizado: sequelize.literal('cupo_utilizado + 1') },
                {
                    where: {
                        id: curso.id,
                        cupo_utilizado: {
                            [Op.lt]: sequelize.col('cupo_maximo')
                        }
                    },
                    transaction
                }
            );
        }

        // Recuperando todos los planes docente de un curso.
        const planesDocente = await PlanDocente.findAll({
            where: { id_curso: curso.id },
            include: modelsPlanDocente,
            transaction
        });

        // Relacionando cada plan docente con el alumno matriculado.
        await Promise.all(planesDocente.map(async (planDocente) => {
            const newPlanEstudiante = {
                fecha_registro: formatDate(currentDate),
                id_plan_docente: planDocente.id,
                id_estudiante: resultEstudiante.id
            };
            await PlanEstudiante.findOrCreate({
                where: {
                    id_plan_docente: newPlanEstudiante.id_plan_docente,
                    id_estudiante: newPlanEstudiante.id_estudiante
                },
                defaults: newPlanEstudiante,
                transaction
            });
        }));

        await transaction.commit();
        response(res, createdMatricula, 'Matricula creada exitosamente.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.updateMatricula = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { acudiente, matricula, curso_anterior  } = req.body;
        const { estado_matricula, curso, estudiante: info_estudiante } = matricula;
        const { persona: estudiante, estado_estudiante } = info_estudiante;

        matricula.fecha_registro = formatDate(matricula.fecha_registro);
        const datosAcudiente = getDatosPersona(acudiente);
        const datosEstudiante = getDatosPersona(estudiante);
        const infoEstudiante = getDatosEstudiante(info_estudiante, acudiente, estudiante, estado_estudiante);
        
        // Actualizando acudiente (persona)
        await Persona.update(datosAcudiente, {
            where: { id: acudiente.id },
            transaction
        });
        // Actualizando estudiante (persona)
        await Persona.update(datosEstudiante, {
            where: { id: estudiante.id },
            transaction
        });

        // Actualizando info academica de estudiante
        const updateEstudiante = await Estudiante.findOne({
            where: { id_persona: estudiante.id },
            transaction
        });
        await Estudiante.update(infoEstudiante, {
            where: { id: updateEstudiante.id },
            transaction
        });

        const previousCurso = await Curso.findByPk(curso_anterior.id, { transaction });
        const currentCurso = await Curso.findByPk(curso.id, { transaction });
        const materiasPreviousCurso = await PlanEstudiante.findAll({
            where: {
                id_estudiante: updateEstudiante.id,
                '$plan_docente.id_anio_lectivo$': previousCurso.id_anio_lectivo
            },
            include: modelsPlanEstudiante,
            transaction
        });

        const planesDocente = await PlanDocente.findAll({
            where: {
                id_curso: currentCurso.id,
                id_anio_lectivo: currentCurso.id_anio_lectivo
            },
            transaction
        });

        if (materiasPreviousCurso) {
            await Promise.all(materiasPreviousCurso.map(async (materiaPreviousCurso) => {
                await PlanEstudiante.destroy({
                    where: { id: materiaPreviousCurso.id },
                    transaction
                });
            }));
        }

        if (planesDocente) {
            await Promise.all(planesDocente.map(async (planDocente) => {
                const newPlanEstudiante = {
                    fecha_registro: formatDate(getCurrentDate()),
                    id_plan_docente: planDocente.id,
                    id_estudiante: updateEstudiante.id
                };
                await PlanEstudiante.findOrCreate({
                    where: {
                        id_plan_docente: newPlanEstudiante.id_plan_docente,
                        id_estudiante: newPlanEstudiante.id_estudiante
                    },
                    defaults: newPlanEstudiante,
                    transaction
                });
            }));
        }

        if (previousCurso.cupo_utilizado > 0) {
            await Curso.update(
                { cupo_utilizado: sequelize.literal('cupo_utilizado - 1') },
                {
                    where: {
                        id: previousCurso.id,
                        cupo_utilizado: {
                            [Op.lt]: sequelize.col('cupo_maximo')
                        }
                    },
                    transaction
                }
            );
        }

        if (currentCurso.cupo_utilizado < currentCurso.cupo_maximo) {
            await Curso.update(
                { cupo_utilizado: sequelize.literal('cupo_utilizado + 1') },
                {
                    where: {
                        id: currentCurso.id,
                        cupo_utilizado: {
                            [Op.lt]: sequelize.col('cupo_maximo')
                        }
                    },
                    transaction
                }
            );
        }
        
        matricula.id_curso = currentCurso.id;
        const updatedMatricula = await Matricula.update(matricula, {
            where: { id: matricula.id },
            transaction
        });

        await transaction.commit();
        response(res, updatedMatricula, 'Matricula actualizada.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyMatricula = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let { id } = req.params, matricula, estudiante, deleted = false;
        [, [matricula]] = await Matricula.update({ vigente: false }, {
            where: { id },
            returning: true,
            transaction
        });
        if (matricula) {
            [, [estudiante]] = await Estudiante.update({ vigente: false }, {
                where: { id: matricula.id_estudiante },
                returning: true,
                transaction
            });
            if (estudiante) deleted = true;
        }
        await transaction.commit();
        response(res, deleted, 'Matricula eliminada.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.isMatriculado = async (req, res, next) => {
    try {
        const { documento } = req.params;
        let message = 'Estudiante no esta matriculado.';
        let isMatriculado = false;
        const matriculado = await Matricula.findOne({
            where: {
                '$estudiante.persona.documento$': documento,
                '$anio_lectivo.anio_actual$': currentYear
            },
            include: modelsMatricula
        });
        if (matriculado) {
            isMatriculado = true;
            message = `Estudiante esta matriculado.`;
        }
        response(res, isMatriculado, message);
    } catch (error) {
        next(error);
    }
};

/*╔════════════════════════════════════════════════════════════════════════════════════════════╗*
                                        Helper Functions                                         
 *╚════════════════════════════════════════════════════════════════════════════════════════════╝*/
const getDatosPersona = (persona) => {
    return {
        documento: persona.documento,
        primer_nombre: persona.primer_nombre || '',
        segundo_nombre: persona.segundo_nombre || '',
        primer_apellido: persona.primer_apellido || '',
        segundo_apellido: persona.segundo_apellido || '',
        fecha_nacimiento: formatDate(persona.fecha_nacimiento),
        numero_telefono: persona.numero_telefono || '',
        numero_celular: persona.numero_celular || '',
        direccion: persona.direccion || '',
        id_rol: persona.id_rol,
        id_tipo_documento: persona.id_tipo_documento,
        id_municipio: persona.id_municipio,
        id_sexo: persona.id_sexo
    };
};

const getDatosEstudiante = (infoEstudiante, infoAcudiente, infoPersona, estadoEstudiante) => {
    return {
        fecha_registro: formatDate(infoEstudiante.fecha_registro),
        fecha_ingreso: formatDate(infoEstudiante.fecha_ingreso),
        id_acudiente: infoAcudiente.id,
        id_persona: infoPersona.id,
        codigo: infoPersona.documento,
        id_estado_estudiante: estadoEstudiante.id
    };
};

const getDatosUsuario = (estudiante, infoPersona) => {
    return {
        username: estudiante.documento,
        password: bcrypt.hashSync(estudiante.documento.slice(-4), 10),
        id_rol: ROL.ESTUDIANTE.id,
        id_persona: infoPersona.id
    };
};

const getDatosMatricula = (matricula, curso, infoEstudiante, estadoMatricula) => {
    return {
        fecha_registro: formatDate(matricula.fecha_registro),
        id_curso: curso.id,
        id_anio_lectivo: curso.id_anio_lectivo,
        id_estudiante: infoEstudiante.id,
        id_estado_matricula: estadoMatricula.id,
    };
};

// 230