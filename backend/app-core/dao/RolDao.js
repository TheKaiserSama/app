const Models =  require('../models/index');
const { sequelize, Sequelize: { Op } } =  require('../models/index');
const { ALL_ROL } = require('../../app-api/helpers/const');

const findOneRol = id => {
    return Models.Rol.findOne({
        where: { id: id }
    });
};

const findAllRol = (arrayRol = ALL_ROL) => {
    const condicion = {};
    if (arrayRol.length > 0) {
        condicion.nombre = {
            [Op.or]: [ ...arrayRol ]
        }
    }

    return Models.Rol.findAll({
        where: condicion
        // where: {
        //     id: { [Op.or]: arrayRol }
        // }
    });
};

const createRol = rol => {
    return Models.Rol.create(rol);
};

const updateRol = (rol, id) => {
    return Models.Rol.update(rol, {
        where: { id: id },
        returning: true
    });
};

const destroyRol = id => {
    return Models.Rol.destroy({
        where: { id: id }
    });
};

const getMenu = id => {
    return sequelize.query(
        `
            SELECT
                r.nombre as "rol",
                o.id_opcion_padre, o.nombre_opcion_padre,
                o.id, o.nombre,
                ro.leer AS leer,
                ro.crear AS crear,
                ro.actualizar AS actualizar,
                ro.eliminar AS eliminar
            FROM rol AS r INNER JOIN ( rol_opcion AS ro INNER JOIN (
                SELECT
                    o1.id as id_opcion_padre,
                    o1.nombre as nombre_opcion_padre,
                    o1.padre as padre_opcion_padre,
                    o2.id, o2.nombre, o2.padre
                FROM opcion AS o1
                CROSS JOIN opcion AS o2 WHERE o1.id = o2.padre
            ) as o
            ON o.id = ro.id_opcion)
            ON r.id = ro.id_rol
            WHERE r.id = ${ id };
        `,
        { type: sequelize.QueryTypes.SELECT }
    );
};

module.exports = {
    findOneRol,
    findAllRol,
    createRol,
    updateRol,
    destroyRol,
    getMenu
};