'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tipo_documento', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true,
            },
            descripcion: {
                type: Sequelize.TEXT,
                defaultValue: ''
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('tipo_documento');
    }

};