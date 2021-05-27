'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Rango = sequelize.define('Rango', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        minimo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maximo: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'rango',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Rango.associate = function(models) {
        Rango.hasMany(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_rango',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Rango;
    
};