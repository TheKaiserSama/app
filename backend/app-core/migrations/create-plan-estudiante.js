'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('plan_estudiante', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            fecha_registro: {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_DATE')
            },
            id_plan_docente: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_estudiante: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('plan_estudiante');
    }

};