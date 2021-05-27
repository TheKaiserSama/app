'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Rol = sequelize.define('Rol', {
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
        tableName: 'rol',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Rol.associate = function(models) {
        Rol.hasMany(models.Usuario, {
            as: 'usuario',
            foreignKey: 'id_rol',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Rol.hasMany(models.Persona, {
            as: 'persona',
            foreignKey: 'id_rol',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Rol;
    
};