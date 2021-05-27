'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('curso', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            grado: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            grupo: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            id_sede: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_anio_lectivo: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_jornada: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('curso');
    }

};