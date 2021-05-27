'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('logro', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            descripcion: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            porcentaje: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false
            },
            vigente: {
                type: Sequelize.BOOLEAN,
                defaultValue: 't'
            },
            id_plan_docente: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('logro');
    }

};