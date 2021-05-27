'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Jornada = sequelize.define('Jornada', {
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
        tableName: 'jornada',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Jornada.associate = function(models) {
        Jornada.hasMany(models.Curso, {
            as: 'curso',
            foreignKey: 'id_jornada',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Jornada;
    
};