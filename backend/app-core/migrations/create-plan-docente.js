'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('plan_docente', {
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
                defaultValue: 't'
            },
            id_materia: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_periodo: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_anio_lectivo: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_curso: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_sede: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_docente: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('plan_docente');
    }

};