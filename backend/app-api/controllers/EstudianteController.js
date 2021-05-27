const { modelsEstudiante } = require('../helpers/includeModels');
const response =  require('../helpers/response');
const db = require('../../app-core/models/index');
const Estudiante = db.Estudiante;

exports.getEstudiantePorNumeroDocumento = async (req, res, next) => {
    try {
        const { documento } = req.params;
        const estudiante = await Estudiante.findOne({
            where: { '$persona.documento$': documento },
            include: modelsEstudiante
        });
        response(res, estudiante, 'Datos estudiante.');
    } catch (error) {
        next(error);
    }
};

exports.getEstudianteByPkPersona = async (req, res, next) => {
    try {
        const { id_persona } = req.params;
        const estudiante = await Estudiante.findOne({
            where: { id_persona },
            include: modelsEstudiante
        });
        response(res, estudiante, 'Datos estudiante.');
    } catch (error) {
        next(error);
    }
};

exports.getCountEstudiantes = async (req, res, next) => {
    try {
        const countEstudiantes = await Estudiante.count({
            where: { vigente: true }
        });
        response(res, countEstudiantes, 'Cantidad de estudiantes.');
    } catch (error) {
        next(error);
    }
};

exports.updateEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estudiante = getEstudiante(req.body);
        const [affectedCount, affectedRows] = await Estudiante.update(estudiante, {
            where: { id }
        });
        response(res, { affectedCount, affectedRows }, `${ affectedCount } registro(s) afectado(s)`);
    } catch (error) {
        next(error);
    }
};

/*╔════════════════════════════════════════════════════════════════════════════════════════════╗*
                                        Helper Functions                                         
 *╚════════════════════════════════════════════════════════════════════════════════════════════╝*/
const getEstudiante = (estudiante) => {
    return {
        fecha_registro: estudiante.fecha_registro,
        fecha_ingreso: estudiante.fecha_ingreso,
        codigo: estudiante.codigo,
        id_estado_estudiante: estudiante.id_estado_estudiante,
        id_persona: estudiante.id_persona,
        id_acudiente: estudiante.id_acudiente,
    };
};