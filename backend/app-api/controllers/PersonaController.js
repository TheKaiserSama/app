const { modelsPersona } = require('../helpers/includeModels');
const response =  require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const { formatDate } = require('../helpers/date');
const { sequelize, Sequelize: { Op } } = require('../../app-core/models/index');
const db = require('../../app-core/models/index');
const Persona = db.Persona;
const Usuario = db.Usuario;

exports.getByPkPersona = async (req, res, next) => {
    try {
        const { id } = req.params;
        const persona = await Persona.findByPk(id, { include: modelsPersona });
        if (!persona) {
            throw new HttpNotFound(`Persona con id=${ id } no encontrada.`);
        }
        response(res, persona, 'Datos persona.');
    } catch (error) {
        next(error);
    }
};

exports.getPersonaPorNumeroDocumento = async (req, res, next) => {
    try {
        const { documento } = req.params;
        const { id } = req.query;
        const condition = { documento };
        if (id) condition.id = { [Op.ne]: id };
        const persona = await Persona.findOne({
            where: condition,
            include: modelsPersona
        });
        response(res, persona, 'Datos persona.');
    } catch (error) {
        next(error);
    }
};

exports.getPersonaAcudiente = async (req, res, next) => {
    try {
        const { documento } = req.params;
        const acudiente = await Persona.findOne({
            where: {
                documento,
                [Op.and]: sequelize.where(
                    sequelize.literal("date_part('year', now()) - date_part('year', fecha_nacimiento)"), '>=', 18
                )
            },
            include: modelsPersona
        });
        if (!acudiente) {
            throw new HttpNotFound(`Persona con documento='${ documento }' no existe o es menor de edad.`);
        }
        console.log('Bsucando el acudiente........');
        response(res, acudiente, 'Datos del acudiente.');
    } catch (error) {
        next(error);
    }
};

exports.getAllPersonas = async (req, res, next) => {
    try {
        const { limit, offset, search_term = '', id_rol } = req.query;
        let message = 'Datos personas.';
        const condition = {};
        if (id_rol) condition.id_rol = id_rol;
        const personas = await Persona.findAndCountAll({
            where: {
                [Op.or]: [
                    { primer_nombre: { [Op.iLike]: `%${ search_term }%` } },
                    { primer_apellido: { [Op.iLike]: `%${ search_term }%` } },
                    { documento: { [Op.iLike]: `%${ search_term }%` } }
                ],
                ...condition
            },
            include: [
                ...modelsPersona,
                {
                    model: Usuario,
                    as: 'usuario'
                }
            ],
            order: [['id', 'DESC']],
            limit,
            offset
        });

        if (personas.rows.length === 0) {
            message = 'No hay personas para listar.';
        }
        response(res, personas, message);
    } catch (error) {
        next(error);
    }
};

exports.findOrCreatePersona = async (req, res, next) => {
    try {
        let created;
        let message = 'Persona creada exitosamente.';
        const newPersona = getDatosPersona(req.body);
        newPersona.fecha_nacimiento = formatDate(newPersona.fecha_nacimiento);
        [persona, created] = await Persona.findOrCreate({
            where: { documento: newPersona.documento },
            defaults: newPersona
        });
        if (!created) {
            message = 'Persona duplicada, no se puede efectuar la operación.';
        }
        response(res, [created, persona], message);
    } catch (error) {
        next(error);
    }
};

exports.updatePersona = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let affectedCount = 0;
        let message = 'Ya existe una persona con la información suministrada.';
        let updated = false;
        const { id } = req.params;
        const newPersona = getDatosPersona(req.body);
        newPersona.fecha_nacimiento = formatDate(newPersona.fecha_nacimiento);
        const foundPersona = await Persona.findOne({
            where: {
                id: { [Op.ne]: id },
                documento: newPersona.documento
            },
            transaction
        });
        if (!foundPersona) {
            updated = true;
            message = 'Persona actualizada exitosamente.';
            [affectedCount] = await Persona.update(newPersona, {
                where: { id },
                transaction
            });
        }
        await transaction.commit();
        response(res, { affectedCount, updated }, message);
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.destroyPersona = async (req, res, next) => {
    try {
        const { id } = req.params;
        let affectedRows = 0;
        let deleted = false;
        const personaInUsuario = await Usuario.findOne({ where: { id_persona: id } });
        if (!personaInUsuario) {
            deleted = true;
            affectedRows = await Persona.destroy({ where: { id } });
        }
        response(res, { affectedRows, deleted }, `${ affectedRows } registro(s) afectado(s).`);
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
        fecha_nacimiento: persona.fecha_nacimiento,
        numero_telefono: persona.numero_telefono || '',
        numero_celular: persona.numero_celular || '',
        direccion: persona.direccion || '',
        id_rol: persona.id_rol,
        id_tipo_documento: persona.id_tipo_documento,
        id_municipio: persona.id_municipio,
        id_sexo: persona.id_sexo
    }
};