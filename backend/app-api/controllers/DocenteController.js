const bcrypt = require('bcryptjs');
const { modelsDocente } = require('../helpers/includeModels');
const { HttpNotFound } = require('../error/customError');
const { formatDate, getCurrentYear } = require('../helpers/date');
const response = require('../helpers/response');
const { ROL } = require('../helpers/const');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const DirectorGrupo = db.DirectorGrupo;
const Docente = db.Docente;
const Persona = db.Persona;
const Usuario = db.Usuario;
const currentYear = getCurrentYear();

exports.getByPkDocente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const docente = await Docente.findByPk(id, { include: modelsDocente });
        if (!docente) {
            throw new HttpNotFound(`Docente con id=${ id } no encontrado.`);
        }
        response(res, docente, 'Datos docente.');
    } catch (error) {
        next(error);
    }
};

exports.getDocentePorCodigo = async (req, res, next) => {
    try {
        const { codigo } = req.params;
        const docente = await Docente.findOne({
            where: { codigo },
            include: modelsDocente
        });
        if (!docente) {
            throw new HttpNotFound(`Docente con codigo=${ codigo } no encontrado.`);
        }
        response(res, docente, 'Datos docente.');
    } catch (error) {
        next(error);
    }
};

exports.getDocenteByPkPersona = async (req, res, next) => {
    try {
        const { id_persona } = req.params;
        const docente = await Docente.findOne({
            where: { id_persona },
            include: modelsDocente
        });
        if (!docente) {
            throw new HttpNotFound(`Docente con id_persona=${ id_persona } no encontrado.`);
        }
        response(res, docente, 'Datos docente.');
    } catch (error) {
        next(error);
    }
};

exports.getAllDocentes = async (req, res, next) => {
    try {
        const { limit, offset, searchTerm } = req.query;
        let message = 'Datos docentes.';
        const docentes = await Docente.findAndCountAll({
            where: {
                [Op.or]: [
                    { '$persona.primer_nombre$': { [Op.iLike]: `%${ searchTerm }%` } },
                    { '$persona.primer_apellido$': { [Op.iLike]: `%${ searchTerm }%` } },
                    { '$persona.documento$': { [Op.iLike]: `%${ searchTerm }%` } }
                ]
            },
            include: modelsDocente,
            order: [
                ['id', 'DESC']
                // [ { model: Models.Persona, as: 'persona'}, 'primer_nombre', 'ASC' ],
                // [ { model: Models.Persona, as: 'persona'}, 'primer_apellido', 'ASC' ]
            ],
            limit,
            offset
        });
        if (docentes.rows.length === 0) {
            message = 'No hay docentes para listar.';
        }
        response(res, docentes, message);
    } catch (error) {
        next(error);
    }
};

exports.getCountDocentes = async (req, res, next) => {
    try {
        const countDocentes = await Docente.count({
            where: { vigente: true }
        });
        response(res, countDocentes, 'Cantidad de docentes.');
    } catch (error) {
        next(error);
    }
};


exports.createDocente = async (req, res, next) => { // Revisar warning de fechas
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { persona } = req.body;

        const datosPersona = getDatosPersona(persona);
        const [resultPersona] = await Persona.findOrCreate({
            where: { documento: datosPersona.documento },
            defaults: datosPersona,
            transaction
        });
        
        const datosDocente = getDatosDocente(req.body, resultPersona);
        const [createdDocente] = await Docente.findOrCreate({
            where: { id_persona: resultPersona.id },
            defaults: datosDocente,
            transaction
        });

        const datosUsuario = getDatosUsuario(resultPersona);
        await Usuario.findOrCreate({
            where: { username: datosUsuario.username },
            defaults: datosUsuario,
            transaction
        });
        await transaction.commit();
        response(res, createdDocente, 'Docente creado.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.updateDocente = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { persona, id } = req.body;

        const datosPersona = getDatosPersona(persona);
        await Persona.update(datosPersona, {
            where: { id: persona.id },
            transaction,
        });

        const datosDocente = {
            vigente: req.body.vigente,
            titulo: req.body.titulo,
            fecha_registro: formatDate(req.body.fecha_registro),
            fecha_ingreso: formatDate(req.body.fecha_ingreso),
            id_estado_docente: req.body.id_estado_docente,
            codigo: persona.documento,
            id_persona: persona.id,
        };
        const [affectedCount, affectedRows] = await Docente.update(datosDocente, {
            where: { id },
            returning: true,
            transaction,
        });
        console.log(req.body);
        await transaction.commit();
        response(res, affectedRows, `${ affectedCount } registro(s) afectado(s).`);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyDocente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [affectedRows] = await Docente.update({ vigente: false }, {
            where: { id }
        });
        response(res, affectedRows, `${ affectedRows } registro(s) afectado(s)`);
    } catch (error) {
        next(error);
    }
};

exports.getDocentesNoDirectoresGrupo = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        const order = [
            [{ model: Persona, as: 'persona' }, 'primer_nombre', 'ASC'],
            [{ model: Persona, as: 'persona' }, 'primer_apellido', 'ASC']
        ];
        const anioLectivo = await AnioLectivo.findOne({ where: { anio_actual: currentYear }, transaction });
        const docentes = await Docente.findAll({
            where: { vigente: true },
            include: modelsDocente,
            order,
            transaction
        });
        const idDocentes = [];
        await Promise.all(docentes.map(async (docente, index) => {
            const directorGrupo = await DirectorGrupo.findOne({
                where: { id_docente: docente.id, id_anio_lectivo: anioLectivo.id },
                transaction
            });
            if (!directorGrupo) idDocentes.push(docentes[index].id);
        }));
        const docentesNoDirectoresGrupo = await Docente.findAndCountAll({
            where: { id: idDocentes },
            include: modelsDocente,
            order,
            limit,
            offset,
        });
        const docentesPaginados = getPagingData(docentesNoDirectoresGrupo, page, limit);

        await transaction.commit();
        response(res, docentesPaginados, 'Docentes sin asignar como directores de grupo');
    } catch (error) {
        if (transaction) transaction.rollback();
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
        fecha_nacimiento: persona.fecha_nacimiento,
        numero_telefono: persona.numero_telefono || '',
        numero_celular: persona.numero_celular || '',
        direccion: persona.direccion || '',
        id_rol: persona.id_rol,
        id_tipo_documento: persona.id_tipo_documento,
        id_municipio: persona.id_municipio,
        id_sexo: persona.id_sexo
    };
};

const getDatosDocente = (infoDocente, infoPersona = {}) => {
    return {
        vigente: true,
        titulo: infoDocente.titulo,
        fecha_registro: formatDate(infoDocente.fecha_registro),
        fecha_ingreso: formatDate(infoDocente.fecha_ingreso),
        id_estado_docente: infoDocente.id_estado_docente,
        codigo: infoPersona.documento || infoDocente.codigo,
        id_persona: infoPersona.id || infoDocente.id_persona,
    };
};

const getDatosUsuario = (infoPersona) => {
    return {
        username: infoPersona.documento,
        password: bcrypt.hashSync(infoPersona.documento.slice(-4), 10),
        id_rol: ROL.DOCENTE.id,
        id_persona: infoPersona.id,
    };
};

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};
  
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: docentes } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, docentes, totalPages, currentPage };
};