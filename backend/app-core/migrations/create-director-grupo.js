'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('director_grupo', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            id_anio_lectivo: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_docente: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_curso: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('director_grupo');
    }

};