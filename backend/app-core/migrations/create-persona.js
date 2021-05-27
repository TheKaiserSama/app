'use strict';
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('persona', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            documento: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            primer_nombre: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            segundo_nombre: {
                type: Sequelize.TEXT
            },
            primer_apellido: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            segundo_apellido: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            fecha_nacimiento: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            numero_telefono: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            numero_celular: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            direccion: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            tipo: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            id_tipo_documento: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_municipio: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id_sexo: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('persona');
    }

};