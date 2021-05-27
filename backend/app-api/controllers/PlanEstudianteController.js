const { modelsPlanEstudiante } = require('../helpers/includeModels');
const response = require('../helpers/response');
const db = require('../../app-core/models/index');
const PlanEstudiante = db.PlanEstudiante;

exports.getPlanEstudiantePorEstudiante = async (req, res, next) => { // Revisar nose que hace
    try {
        const { id_estudiante } = req.params;
        const { id_periodo, id_anio_lectivo, id_materia } = req.query;
        let message = 'Datos materias por curso.';
        const condition = {};
        if (id_estudiante) condition.id_estudiante = id_estudiante;
        if (id_periodo) condition['$plan_docente.id_periodo$'] = id_periodo;
        if (id_anio_lectivo) condition['$plan_docente.id_anio_lectivo$'] = id_anio_lectivo;
        if (id_materia) condition['$plan_docente.id_materia$'] = id_materia;

        const planesEstudiantes = await PlanEstudiante.findOne({
            where: condition,
            include: modelsPlanEstudiante
        });

        if (!planesEstudiantes) {
            message = 'No hay materias para este curso.';
        }
        response(res, planesEstudiantes, message);
    } catch (error) {
        next(error);
    }
};