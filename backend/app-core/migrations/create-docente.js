'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('docente', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            titulo: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            fecha_registro: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_DATE')
            },
            fecha_efecto: {
                type: Sequelize.DATE
            },
            vigente: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            codigo: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            id_estado_docente: {
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
        return queryInterface.dropTable('docente');
    }

};