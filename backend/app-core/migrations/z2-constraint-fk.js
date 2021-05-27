'use strict';

function addForeignKey(localTable, referenceTable) {
    localTable = localTable.toLowerCase();
    referenceTable = referenceTable.toLowerCase();
    return `
        ALTER TABLE ${ localTable }
        ADD CONSTRAINT ${ localTable }_id_${ referenceTable }_fkey
        FOREIGN KEY (id_${ referenceTable })
        REFERENCES ${ referenceTable } (id);
    `;
}

function dropForeignKey(localTable, referenceTable) {
    localTable = localTable.toLowerCase();
    referenceTable = referenceTable.toLowerCase();
    return `
        ALTER TABLE ${ localTable }
        DROP CONSTRAINT ${ localTable }_id_${ referenceTable }_fkey;
    `;
}

module.exports = {

    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(addForeignKey('anio_lectivo', 'estado_anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('anio_lectivo', 'rango'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('materia', 'area'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('municipio', 'departamento'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('periodo', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('persona', 'tipo_documento'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('persona', 'municipio'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('persona', 'sexo'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('rol_opcion', 'rol'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('rol_opcion', 'opcion'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('curso', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('curso', 'jornada'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('curso', 'sede'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('estudiante', 'estado_estudiante'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('estudiante', 'persona'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('docente', 'estado_docente'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('docente', 'persona'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('usuario', 'rol'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('usuario', 'persona'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('curso_materia', 'curso'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('curso_materia', 'materia'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('director_grupo', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('director_grupo', 'curso'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('director_grupo', 'docente'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('notificacion', 'tipo_notificacion'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('notificacion', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('plan_docente', 'materia'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('plan_docente', 'periodo'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('plan_docente', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('plan_docente', 'curso'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('plan_docente', 'sede'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('plan_docente', 'docente'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('inasistencia', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('inasistencia', 'plan_docente'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('logro', 'plan_docente'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('estudiante_logro', 'logro'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('estudiante_logro', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('plan_estudiante', 'plan_docente'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('plan_estudiante', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('actividad', 'logro'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('estudiante_actividad', 'actividad'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('estudiante_actividad', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('matricula', 'estado_matricula'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('matricula', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('matricula', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(addForeignKey('matricula', 'curso'), { transaction });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
                throw err;
        }
    },

    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(dropForeignKey('anio_lectivo', 'estado_anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('anio_lectivo', 'rango'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('materia', 'area'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('municipio', 'departamento'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('periodo', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('persona', 'tipo_documento'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('persona', 'municipio'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('persona', 'sexo'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('rol_opcion', 'rol'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('rol_opcion', 'opcion'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('curso', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('curso', 'jornada'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('curso', 'sede'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('estudiante', 'estado_estudiante'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('estudiante', 'persona'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('docente', 'estado_docente'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('docente', 'persona'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('usuario', 'rol'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('usuario', 'persona'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('curso_materia', 'curso'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('curso_materia', 'materia'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('director_grupo', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('director_grupo', 'curso'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('director_grupo', 'docente'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('notificacion', 'tipo_notificacion'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('notificacion', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('plan_docente', 'materia'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('plan_docente', 'periodo'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('plan_docente', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('plan_docente', 'curso'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('plan_docente', 'sede'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('plan_docente', 'docente'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('inasistencia', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('inasistencia', 'plan_docente'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('logro', 'plan_docente'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('estudiante_logro', 'logro'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('estudiante_logro', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('plan_estudiante', 'plan_docente'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('plan_estudiante', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('actividad', 'logro'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('estudiante_actividad', 'actividad'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('estudiante_actividad', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('matricula', 'estado_matricula'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('matricula', 'estudiante'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('matricula', 'anio_lectivo'), { transaction });
            await queryInterface.sequelize.query(dropForeignKey('matricula', 'curso'), { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
                throw err;
        }
    }

};