const ValoracionFormativaDao = require('../../app-core/dao/ValoracionFormativaDao');
const response = require('../helpers/response');

const getAllValoracionesFormativas = async (req, res, next) => {
    try {
        const condition = {};
        if ('vigente' in req.query) condition.vigente = req.query.vigente;
        const valoracionesFormativas = await ValoracionFormativaDao.findAll(condition, [['descripcion', 'ASC']]);

        response(res, valoracionesFormativas, 'Valoraciones formativas.');
    } catch (error) {
        next(error);
    }
};

const createValoracionFormativa = async (req, res, next) => {
    try {
        const { descripcion, vigente } = req.body;
        const valoracionFormativaData = { descripcion, vigente };
        let wasCreated = false;
        const valoracionFormativa = await ValoracionFormativaDao.create(valoracionFormativaData);
        if (valoracionFormativa) wasCreated = true;

        response(res, { created: wasCreated }, 'Operación realizada.');
    } catch (error) {
        next(error);
    }
};

const updateValoracionFormativa = async (req, res, next) => {
    try {
        const { id_valoracion_formativa } = req.params;
        const { descripcion, vigente } = req.body;
        let affectedRowsCount = 0;
        [affectedRowsCount] = await ValoracionFormativaDao.update({ descripcion, vigente }, { id: id_valoracion_formativa });

        response(res, { affectedRowsCount }, 'Valoración formativa actualizada.');
    } catch (error) {
        next(error);
    }
};

const deleteValoracionFormativa = async (req, res, next) => {
    try {
        const { id_valoracion_formativa } = req.params;
        const affectedRowsCount = await ValoracionFormativaDao.destroy({ id: id_valoracion_formativa });
        response(res, { affectedRowsCount }, 'Valoración formativa eliminada.');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllValoracionesFormativas,
    createValoracionFormativa,
    updateValoracionFormativa,
    deleteValoracionFormativa
};