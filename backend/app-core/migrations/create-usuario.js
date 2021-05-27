'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('usuario', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            username: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            ultima_sesion: {
                type: Sequelize.DATE
            },
            fecha_creacion: {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_DATE')
            },
            id_rol: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_persona: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('usuario');
    }

};