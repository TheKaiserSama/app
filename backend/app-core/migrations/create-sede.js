'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('sede', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            descripcion: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            direccion: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            telefono: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('sede');
    }

};