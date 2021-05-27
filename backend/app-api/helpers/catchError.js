const { HttpError } = require('../error/customError');
const { Sequelize: { ForeignKeyConstraintError } } = require('../../app-core/models/index');

module.exports = (err, res) => {
    switch(true) {
        case err instanceof HttpError:
            res.status(err.code).json(err);
        break;
        case err instanceof ForeignKeyConstraintError:
            res.status(500).json({
                error: true,
                name: 'Error en Base de datos',
                status: 500,
                message: 'No se puede realizar la operacion, conflicto en la base de datos.'
            });
        break;
        default:
            res.status(500).json({
                error: true,
                name: 'INTERNAL_ERROR',
                status: 500,
                message: err.message
            });
        break;
    }
};