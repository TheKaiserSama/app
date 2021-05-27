'use strict';
const hooks = require("../../app-api/helpers/hooks");

module.exports = (sequelize, DataTypes) => {
    
    const Area = sequelize.define('Area', {
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
        tableName: 'area',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Area.associate = function(models) {
        Area.hasMany(models.Materia, {
            as: 'materia',
            foreignKey: 'id_area',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    Area.addHook('beforeCreate', (area, options) => {
        area.nombre = hooks.capitalize(area.nombre);
    });

    Area.addHook('beforeBulkUpdate', ({ attributes }) => {
        attributes.nombre = hooks.capitalize(attributes.nombre);
    });

    return Area;
    
};