'use strict';

module.exports = (sequelize, DataTypes) => {

    const ValoracionFormativa = sequelize.define('ValoracionFormativa', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {       
        tableName: 'valoracion_formativa',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    ValoracionFormativa.associate = function(models) {
        ValoracionFormativa.hasMany(models.ValoracionCualitativa, {
            as: 'valoracion_cualitativa',
            foreignKey: 'id_valoracion_formativa',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return ValoracionFormativa;

};