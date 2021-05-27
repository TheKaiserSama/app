'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('area', {
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
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('area');
    }

};