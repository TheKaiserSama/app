'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('estudiante_logro', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            nota: {
                type: Sequelize.DECIMAL(3, 2),
                allowNull: false
            },
            id_logro: {
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
        return queryInterface.dropTable('estudiante_logro');
    }

};