'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Actividad = sequelize.define('Actividad', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        porcentaje: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        id_logro: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'actividad',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Actividad.associate = function(models) {
        Actividad.hasMany(models.EstudianteActividad, {
            as: 'estudiante_actividad',
            foreignKey: 'id_actividad',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Actividad.belongsTo(models.Logro, {
            as: 'logro',
            foreignKey: 'id_logro',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Actividad;
    
};