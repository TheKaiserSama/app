const response = require('../helpers/response');
const { HttpNotFound } = require('../error/customError');
const db = require('../../app-core/models/index');
const TipoDocumento = db.TipoDocumento;

exports.getByPkTipoDocumento = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tipoDocumento = await TipoDocumento.findByPk(id);
        if (!tipoDocumento) {
            throw new HttpNotFound(`Tipo de documento con id='${ id }' no encontrado.`);
        }
        response(res, tipoDocumento, 'Datos tipos documento.');
    } catch (error) {
        next(error);
    }
};

exports.getAllTiposDocumentos = async (req, res, next) => {
    try {
        let message = 'Datos tipos de documento.';
        const tiposDocumentos = await TipoDocumento.findAll({
            order: [['id', 'ASC']]
        });
        if (tiposDocumentos.length === 0) {
            message = 'No hay tipos de documento para listar.';
        }
        response(res, tiposDocumentos, message);
    } catch (error) {
        next(error);
    }
};