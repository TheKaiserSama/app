'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const EstudianteActividad = sequelize.define('EstudianteActividad', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nota: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false
        },

        id_actividad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'estudiante_actividad',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    EstudianteActividad.associate = function(models) {
        EstudianteActividad.belongsTo(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        EstudianteActividad.belongsTo(models.Actividad, {
            as: 'actividad',
            foreignKey: 'id_actividad',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return EstudianteActividad;
    
};