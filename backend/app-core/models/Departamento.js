'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Departamento = sequelize.define('Departamento', {
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
        }
    }, {       
        tableName: 'departamento',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Departamento.associate = function(models) {
        Departamento.hasMany(models.Municipio, {
            as: 'municipio',
            foreignKey: 'id_departamento',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Departamento;
    
};