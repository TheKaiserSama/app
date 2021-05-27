'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('estado_anio_lectivo', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            descripcion: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('estado_anio_lectivo');
    }

};