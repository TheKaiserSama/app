'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('estudiante', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            fecha_registro: {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_DATE')
            },
            fecha_efecto: {
                type: Sequelize.DATEONLY
            },
            vigente: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            codigo: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            id_estado_estudiante: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            id_persona: {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('estudiante');
    }

};