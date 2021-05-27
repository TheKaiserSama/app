'use strict';
module.exports = {
    
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('actividad', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            descripcion: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            porcentaje: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false
            },
            id_logro: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('actividad');
    }

};