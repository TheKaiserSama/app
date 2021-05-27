'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Institucion = sequelize.define('Institucion', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        mision: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        vision: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        himno: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        lema: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    }, {       
        tableName: 'institucion',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Institucion.associate = function(models) {
        Institucion.hasMany(models.Sede, {
            as: 'sede',
            foreignKey: 'id_institucion',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Institucion;
    
};