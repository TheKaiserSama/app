'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Estudiante = sequelize.define('Estudiante', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        fecha_registro: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURRENT_DATE')
        },
        fecha_ingreso: {
            type: DataTypes.DATEONLY
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        codigo: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        id_estado_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_persona: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_acudiente: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'estudiante',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Estudiante.associate = function(models) {
        Estudiante.hasMany(models.EstudianteActividad, {
            as: 'estudiante_actividad',
            foreignKey: 'id_estudiante',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Estudiante.hasMany(models.EstudianteLogro, {
            as: 'estudiante_logro',
            foreignKey: 'id_estudiante',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Estudiante.belongsTo(models.EstadoEstudiante, {
            as: 'estado_estudiante',
            foreignKey: 'id_estado_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Estudiante.hasMany(models.Notificacion, {
            as: 'notificacion',
            foreignKey: 'id_estudiante',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Estudiante.hasMany(models.Inasistencia, {
            as: 'inasistencia',
            foreignKey: 'id_estudiante',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Estudiante.hasMany(models.PlanEstudiante, {
            as: 'plan_estudiante',
            foreignKey: 'id_estudiante',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Estudiante.hasMany(models.Matricula, {
            as: 'matricula',
            foreignKey: 'id_estudiante',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Estudiante.belongsTo(models.Persona, {
            as: 'persona',
            foreignKey: 'id_persona',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Estudiante.hasMany(models.Boletin, {
            as: 'boletin',
            foreignKey: 'id_estudiante',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Estudiante;
    
};