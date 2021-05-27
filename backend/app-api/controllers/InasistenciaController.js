const { modelsInasistencia, modelsNotificacion } = require('../helpers/includeModels');
const InasistenciaDao = require('../../app-core/dao/InasistenciaDao');
const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { getCurrentDate, formatDate } = require('../helpers/date');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Curso = db.Curso;
const Grado = db.Grado;
const Grupo = db.Grupo;
const Inasistencia = db.Inasistencia;
const Notificacion = db.Notificacion;
const PlanDocente = db.PlanDocente;

exports.getByPkInasistencia = async (req, res, next) => {
    try {
        const { id } = req.params;
        const inasistencia = await Inasistencia.findByPk(id, {
            include: modelsInasistencia
        });
        
        if (!inasistencia) {
            throw new HttpNotFound(`Inasistencia con id=${ id } no encontrada.`);
        }
        response(res, inasistencia, 'Datos inasistencia.');
    } catch (error) {
        next(error);
    }
};

exports.findInasistenciaByParams = async (req, res, next) => { // Corregir cuando ese en angular
    try {
        const inasistencias = await InasistenciaDao.findInasistenciaByParams(req.query);
        response(res, inasistencias, 'Todo salio bien.');
    } catch (error) {
        next(error);
    }
};

exports.getAllInasistenciasAdministrador = async (req, res, next) => { // Arregalar cuando se construya la pantalla en angular
    try {
        const inasistencias = await InasistenciaDao.findAllInasistencia(req.query, []);
        response(res, inasistencias, 'Lista de inasistencias.');
    } catch (error) {
        next(error);
    }
};

exports.getAllInasistenciasDocente = async (req, res, next) => {
    try {
        const { limit, offset, search_term = '', id_docente, id_sede, id_anio_lectivo, id_curso, id_materia } = req.query;
        const condition = {
            [Op.or]: [
                {
                    '$estudiante.persona.primer_nombre$': { [Op.iLike]: `%${ search_term }%` }
                },
                {
                    '$estudiante.persona.primer_apellido$': { [Op.iLike]: `%${ search_term }%` }
                },
                {
                    '$estudiante.persona.documento$': { [Op.iLike]: `%${ search_term }%` }
                }
            ]
        };
        if (id_docente) condition['$plan_docente.docente.id$'] = id_docente;
        if (id_sede) condition['$plan_docente.sede.id$'] = id_sede;
        if (id_anio_lectivo) condition['$plan_docente.anio_lectivo.id$'] = id_anio_lectivo;
        if (id_curso) condition['$plan_docente.curso.id$'] = id_curso;
        if (id_materia) condition['$plan_docente.materia.id$'] = id_materia;
        const inasistencias = await Inasistencia.findAndCountAll({
            where: condition,
            include: modelsInasistencia,
            order: [
                ['fecha', 'DESC'],
                [ { model: PlanDocente, as: 'plan_docente' }, { model: Curso, as: 'curso' }, { model: Grado, as: 'grado' }, 'grado', 'DESC' ],
                [ { model: PlanDocente, as: 'plan_docente' }, { model: Curso, as: 'curso' }, { model: Grupo, as: 'grupo' }, 'descripcion', 'ASC' ]
            ],
            limit,
            offset
        });
        console.log(req.query);
        response(res, inasistencias, 'Lista de inasistencias.');
    } catch (error) {
        next(error);
    }
};

exports.getAllInasistenciasEstudiante = async (req, res, next) => {
    try {
        const { limit, offset, id_estudiante, id_sede, id_anio_lectivo, id_curso, id_materia } = req.query;
        const condition = {};
        if (id_estudiante) condition.id_estudiante = id_estudiante;
        if (id_sede) condition['$plan_docente.sede.id$'] = id_sede;
        if (id_anio_lectivo) condition['$plan_docente.anio_lectivo.id$'] = id_anio_lectivo;
        if (id_curso) condition['$plan_docente.id_curso$'] = id_curso;
        if (id_materia) condition['$plan_docente.materia.id$'] = id_materia;

        const inasistencias = await Inasistencia.findAndCountAll({
            where: condition,
            include: modelsInasistencia,
            order: [['id', 'DESC']],
            limit,
            offset
        });
        response(res, inasistencias, 'Lista de inasistencias.');
    } catch (error) {
        next(error);
    }
};

exports.findOrCreateInasistencia = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        console.log(req.body);

        const { inasistencias, objParams } = req.body;
        const { idPlanDocente, fecha: _fecha } = objParams;

        const planDocente = await PlanDocente.findByPk(idPlanDocente, { transaction });
        const paramsBusqueda = {
            id_plan_docente: idPlanDocente,
            // fecha: _fecha,
            '$plan_docente.id_curso$': planDocente.id_curso,
        };
        const arrayCondicion = [{ ...paramsBusqueda }];
        const sequelizeWhere = sequelize.where(
            sequelize.cast(sequelize.col('fecha'), 'date'), { [Op.eq]: _fecha }
        );
        arrayCondicion.push(sequelizeWhere);

        const eliminarInasistencias = await Inasistencia.findAll({
            where: { [Op.and]: [ ...arrayCondicion ] },
            include: modelsInasistencia,
            transaction
        });
        console.log(JSON.parse(JSON.stringify(eliminarInasistencias)));
        const idInasistencias = eliminarInasistencias.map(item => item.id);

        const currentDate = formatDate(new Date());
        await Inasistencia.destroy({ where: { id: idInasistencias }, transaction });
        
        if (inasistencias.length > 0) {
            await Promise.all(inasistencias.map(async (inasistencia) => {
                const { estudiante, plan_docente, fecha, justificado, id_estudiante, id_plan_docente } = inasistencia;
                const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = estudiante.persona;
                const onlyDate = fecha.split(' ')[0];
                const condition = {
                    [Op.and]: [
                        { id_estudiante, id_plan_docente },
                        sequelize.where(
                            sequelize.cast(sequelize.col('fecha'), 'date'), { [Op.eq]: onlyDate }
                        )
                    ]
                };
                const [_inasistencia, created] = await Inasistencia.findOrCreate({
                    where: condition,
                    defaults: { fecha: onlyDate, justificado, id_estudiante, id_plan_docente },
                    transaction
                });
                if (!created) {
                    await Inasistencia.update(inasistencia, {
                        where: { id: _inasistencia.id },
                        transaction
                    });
                }
                
                const params = {
                    id_estudiante: estudiante.id,
                    id_plan_docente: plan_docente.id,
                    fecha: _fecha || currentDate,
                    mensaje: `El estudiante ${ primer_nombre } ${ segundo_nombre } ${ primer_apellido } ${ segundo_apellido } no asistió a la clase de ${ plan_docente.materia.nombre }.`
                };
                
                const notificacion = {
                    id_tipo_notificacion: 1,
                    id_actividad: null,
                    ...params
                };
                delete notificacion.fecha;

                const existeNotificacion = await Notificacion.findOne({
                    where: {
                        [Op.and]: [
                            {
                                mensaje: params.mensaje,
                                id_estudiante: params.id_estudiante,
                                id_plan_docente: params.id_plan_docente
                            },
                            sequelize.where(
                                sequelize.cast(sequelize.col('fecha'), 'date'),
                                { [Op.eq]: fecha }
                            )
                        ]
                    },
                    include: modelsNotificacion,
                    transaction
                });
                if (!existeNotificacion) {
                    await Notificacion.create(notificacion);
                }
            }));
        }
        await transaction.commit();
        response(res, { created: true }, 'Inasistencias creadas.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.createInasistencia = async (req, res, next) => {
    try {
        let message = 'Inasistencia creada exitosamente.';
        const createdInasistencia = await Inasistencia.create(req.body);
        if (!createdInasistencia) {
            message = 'No se pudo crear la inasistencia.';
        }
        response(res, createdInasistencia, message);
    } catch (error) {
        next(error);
    }
};

const bulkCreateInasistencias = async (req, res, next) => { // No se esta usando
    try {
        let created = false;
        const inasistencias = req.body;
        if (inasistencias.length > 0) {
            const currentDate = getCurrentDate();
            const newInasistencias = inasistencias.map(item => ({ ...item, fecha: currentDate }));
            const createdInasistencias = await Inasistencia.bulkCreate(newInasistencias, {
                updateOnDuplicate: ['vigente', 'fecha', 'justificado', 'id_estudiante', 'id_plan_docente']
            });
            if (createdInasistencias.length > 0) {
                created = true;
            }
        }
        response(res, { created }, 'Inasistencias creadas.');
    } catch (error) {
        next(error);
    }
};

exports.updateInasistencia = async (req, res, next) => {
    try {
        let message = 'Registro actualizado.', affectedRows = 0;
        const { id } = req.params;
        [affectedRows] = await Inasistencia.update(req.body, {
            where: { id },
            returning: true
        });
        if (affectedRows < 1) {
            message = 'No se modificó el registro.';
        }
        response(res, { affectedRows }, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};

exports.destroyInasistencia = async (req, res, next) => {
    try {
        const { id } = req.params;
        let affectedRows = 0;
        let deleted = false;
        affectedRows = await Inasistencia.destroy({ where: { id } });
        if (affectedRows > 0) {
            deleted = true;
        }
        response(res, { affectedRows, deleted }, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};