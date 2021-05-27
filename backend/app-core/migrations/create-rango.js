'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('rango', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            descripcion: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            minimo: {
                type:Sequelize.INTEGER,
                allowNull: false
            },
            maximo: {
                type:Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('rango');
    }

};