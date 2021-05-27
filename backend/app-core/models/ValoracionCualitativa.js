'use strict';

module.exports = (sequelize, DataTypes) => {

    const ValoracionCualitativa = sequelize.define('ValoracionCualitativa', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nunca: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        a_veces: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        siempre: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        id_valoracion_formativa: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_boletin: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {       
        tableName: 'valoracion_cualitativa',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    ValoracionCualitativa.associate = function(models) {
        ValoracionCualitativa.belongsTo(models.ValoracionFormativa, {
            as: 'valoracion_formativa',
            foreignKey: 'id_valoracion_formativa',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        ValoracionCualitativa.belongsTo(models.Boletin, {
            as: 'boletin',
            foreignKey: 'id_boletin',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return ValoracionCualitativa;

}