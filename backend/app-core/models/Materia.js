'use strict';
const hooks = require("../../app-api/helpers/hooks");

module.exports = (sequelize, DataTypes) => {
    
    const Materia = sequelize.define('Materia', {
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
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 't'
        },
        id_area: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'materia',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Materia.associate = function(models) {
        Materia.belongsTo(models.Area, {
            as: 'area',
            foreignKey: 'id_area',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Materia.hasMany(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_materia',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Materia.hasMany(models.GradoMateria, {
            as: 'grado_materia',
            foreignKey: 'id_materia',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    Materia.addHook('beforeCreate', (materia, options) => {
        materia.nombre = hooks.capitalize(materia.nombre);
    });

    Materia.addHook('beforeBulkUpdate', ({ attributes }) => {
        attributes.nombre = hooks.capitalize(attributes.nombre);
    });

    return Materia;
    
};