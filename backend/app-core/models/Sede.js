'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Sede = sequelize.define('Sede', {
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
        direccion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        telefono: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_institucion: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'sede',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Sede.associate = function(models) {
        Sede.hasMany(models.Curso, {
            as: 'curso',
            foreignKey: 'id_sede',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Sede.hasMany(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_sede',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Sede.belongsTo(models.Institucion, {
            as: 'institucion',
            foreignKey: 'id_institucion',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Sede;
    
};