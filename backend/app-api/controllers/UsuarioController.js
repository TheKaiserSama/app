const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { modelsUsuario, modelsDocente, modelsDirectorGrupo, modelsEstudiante } = require('../helpers/includeModels');
const response = require('../helpers/response');
const ordenarMenu = require('../helpers/ordenarMenu');
const { HttpBadRequest, HttpNotFound } = require('../error/customError');
const { getCurrentYear, getCurrentDate, formatDate } = require('../helpers/date');
const db = require('../../app-core/models/index');
const { sequelize } = require('../../app-core/models/index');
const AnioLectivo = db.AnioLectivo;
const DirectorGrupo = db.DirectorGrupo;
const Docente = db.Docente;
const Estudiante = db.Estudiante;
const Usuario = db.Usuario;
const currentDate = getCurrentDate();
const currentYear = getCurrentYear();

exports.getByPkUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, { include: modelsUsuario });
        if (!usuario) {
            throw new HttpNotFound(`Usuario con id=${ id } no encontrado.`);
        }
        response(res, usuario, 'Datos del usuario.');
    } catch (error) {
        next(error);
    }
};

exports.getAllUsuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario.findAll({
            include: modelsUsuario,
            order: [['id', 'DESC']]
        });
        if (usuarios.length === 0) {
            return response(res, usuarios, 'No hay usuarios para listar.');
        }
        response(res, usuarios, 'Datos de los usuarios');
    } catch (error) {
        next(error);
    }
};

exports.createUsuario = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { username, password } = req.body;
        let created = false;
        if (!username || !password) {
            throw new HttpBadRequest('Por favor, el usuario y contraseña son obligatorios.');
        }
        const usuario = await Usuario.findOne({
            where: { username },
            include: modelsUsuario
        });
        if (usuario) {
            throw new HttpBadRequest('El usuario ya existe.');
        }
        const datosUsuario = getDatosUsuario(req.body);
        const createdUsuario = await Usuario.create(datosUsuario);
        if (createdUsuario) created = true;
        await transaction.commit();
        response(res, created, 'Usuario creado exitosamente.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

exports.updateUsuario = async (req, res, next) => {
    try {
        const datosUsuario = getDatosUsuario(req.body);
        const results = await Usuario.update(datosUsuario, {
            where: { id: req.params.id },
            returning: true
        });
        const [affectedCount, affectedRows] = results;
        response(res, { affectedCount, affectedRows }, `${ affectedCount } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};

exports.destroyUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const affectedRows = await Usuario.destroy({ where: { id } });
        response(res, { affectedRows }, `${ affectedRows } registro(s) afectado(s).`);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const { username, password } = req.body;
        if (!username || !password) {
            throw new HttpBadRequest('Por favor, el usuario y contraseña son obligatorios.');
        }
        const usuario = await Usuario.findOne({
            where: { username },
            include: modelsUsuario,
            transaction
        });
        if (!usuario) {
            throw new HttpNotFound('El usuario no existe.');
        }
        const isMatch = bcrypt.compareSync(password, usuario.password);
        if (isMatch) {
            const userData = {
                ...usuario.toJSON(),
                expiresIn: 86400,
                token: await createToken(usuario, transaction),
                // token: await createToken(usuario, menuOrdenado),
                // menu: menuOrdenado
            };
            delete userData.password;
            console.log(userData);

            await transaction.commit();
            return response(res, userData, 'Datos de sesión del usuario.');
        }
        console.log('Sera que pasó?');
        throw new HttpBadRequest('El usuario o la contraseña son incorrectos.');
    } catch (error) {
        if (transaction) await transaction.rollback();
        next(error);
    }
};

/*╔════════════════════════════════════════════════════════════════════════════════════════════╗*
                                        Helper Functions                                         
 *╚════════════════════════════════════════════════════════════════════════════════════════════╝*/
const createToken = async (usuario, transaction) => {
    const localUser = JSON.parse(JSON.stringify(usuario));
    const { id } = localUser.persona;

    if (localUser.rol.nombre == 'Docente') {
        const anioLectivo = await AnioLectivo.findOne({
            where: { anio_actual: currentYear },
            transaction
        });
        const docente = await Docente.findOne({
            where: { id_persona: id },
            include: modelsDocente
        });
        const _docente = docente.toJSON();
        const directorGrupo = await DirectorGrupo.findAll({
            where: {
                id_docente: docente.id,
                id_anio_lectivo: anioLectivo.id
            },
            include: modelsDirectorGrupo,
            transaction
        });
        if (directorGrupo)
            _docente.director_grupo = directorGrupo;
        
        if (docente) localUser.docente = _docente;
    }

    if (usuario.rol.nombre == 'Estudiante') {
        const estudiante = await Estudiante.findOne({
            where: { id_persona: id },
            include: modelsEstudiante,
            transaction
        });
        if (estudiante) localUser.estudiante = estudiante;
    }
    
    const datosUsuario = {
        ...localUser,
        expiresIn: 86400,
        menu: []
    };

    return jwt.sign(datosUsuario, process.env.JWT_SECRET, {
        expiresIn: 86400
    });
};

const getDatosUsuario = (usuario) => {
    return {
        username: usuario.username,
        password: bcrypt.hashSync(usuario.password, 10),
        id_persona: usuario.id_persona,
        id_rol: usuario.id_rol,
        fecha_creacion: usuario.fecha_creacion || formatDate(currentDate),
        ultima_sesion: usuario.ultima_sesion || null
    };
};