'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('inasistencia', {      
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            vigente: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            fecha: {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_DATE')
            },
            id_estudiante: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_plan_docente: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('inasistencia');
    }

};