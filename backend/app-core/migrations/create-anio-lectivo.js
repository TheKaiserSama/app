'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('anio_lectivo', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            descripcion: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            anio_actual: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_estado_anio_lectivo: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_rango: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('anio_lectivo');
    }

};