'use strict';

function addPrimaryKey(tableName) {
    tableName = tableName.toLowerCase();
    return `
        ALTER TABLE ${ tableName }
        ADD CONSTRAINT ${ tableName }_pkey
        PRIMARY KEY (id);
    `;
}

function dropPrimaryKey(tableName) {
    tableName = tableName.toLowerCase();
    return `
        ALTER TABLE ${ tableName }
        DROP CONSTRAINT ${ tableName }_pkey;
    `;
}


module.exports = {

    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(addPrimaryKey('actividad'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('area'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('curso'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('departamento'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('director_grupo'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('docente'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('estado_anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('estado_docente'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('estado_estudiante'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('estado_matricula'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('estudiante'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('inasistencia'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('jornada'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('logro'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('materia'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('matricula'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('municipio'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('estudiante_actividad'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('estudiante_logro'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('notificacion'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('opcion'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('periodo'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('persona'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('plan_docente'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('plan_estudiante'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('rango'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('rol'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('rol_opcion'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('sede'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('sexo'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('tipo_documento'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('tipo_notificacion'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('usuario'), { transaction });
            await queryInterface.sequelize.query(addPrimaryKey('curso_materia'), { transaction });
            await transaction.commit();
        } catch(err) {
                await transaction.rollback();
                throw err;
        }
    },
        
    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(dropPrimaryKey('actividad'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('area'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('curso'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('departamento'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('director_grupo'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('docente'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('estado_anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('estado_docente'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('estado_estudiante'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('estado_matricula'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('estudiante'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('inasistencia'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('jornada'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('logro'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('materia'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('matricula'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('municipio'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('estudiante_actividad'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('estudiante_logro'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('notificacion'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('opcion'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('periodo'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('persona'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('plan_docente'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('plan_estudiante'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('rango'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('rol'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('rol_opcion'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('sede'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('sexo'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('tipo_documento'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('tipo_notificacion'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('usuario'), { transaction });
            await queryInterface.sequelize.query(dropPrimaryKey('curso_materia'), { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
                throw err;
        }
    }

};
