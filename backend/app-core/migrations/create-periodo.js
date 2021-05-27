'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('periodo', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            numero: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            fecha_inicio: {
                type: Sequelize.DATE,
                allowNull: false
            },
            fecha_finalizacion: {
                type: Sequelize.DATE,
                allowNull: false
            },
            descripcion: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            id_anio_lectivo: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('periodo');
    }

};