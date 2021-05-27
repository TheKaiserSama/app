'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('matricula', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            fecha_ingreso: {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_DATE')
            },
            vigente: {
                type: Sequelize.BOOLEAN,
                defaultValue: 't'   
            },
            id_estado_matricula: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_estudiante: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_anio_lectivo: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_curso: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('matricula');
    }

};