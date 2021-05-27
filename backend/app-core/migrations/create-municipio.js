'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('municipio', {
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
            id_departamento: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('municipio');
    }

};