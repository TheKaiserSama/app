'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('notificacion', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            mensaje: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            fecha: {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.literal('CURRENT_DATE')
            },
            vigente: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            id_tipo_notificacion: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_estudiante: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('notificacion');
    }

};