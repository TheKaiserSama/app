'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    
    const PlanDocente = sequelize.define('PlanDocente', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        fecha_registro: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURRENT_DATE'),
            get: function() {
                return moment.utc(this.getDataValue('fecha_registro')).format('YYYY-MM-DD');
            }
        },
        fecha_ingreso: {
            type: DataTypes.DATEONLY,
            get: function() {
                return moment.utc(this.getDataValue('fecha_ingreso')).format('YYYY-MM-DD');
            }
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            defaultValue: 't'
        },
        id_materia: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_periodo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_curso: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_sede: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_docente: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'plan_docente',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    PlanDocente.associate = function(models) {
        PlanDocente.belongsTo(models.Curso, {
            as: 'curso',
            foreignKey: 'id_curso',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanDocente.belongsTo(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanDocente.belongsTo(models.Sede, {
            as: 'sede',
            foreignKey: 'id_sede',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanDocente.belongsTo(models.Materia, {
            as: 'materia',
            foreignKey: 'id_materia',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanDocente.belongsTo(models.Periodo, {
            as: 'periodo',
            foreignKey: 'id_periodo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanDocente.belongsTo(models.Docente, {
            as: 'docente',
            foreignKey: 'id_docente',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanDocente.hasMany(models.Inasistencia, {
            as: 'inasistencia',
            foreignKey: 'id_plan_docente',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanDocente.hasMany(models.Logro, {
            as: 'logro',
            foreignKey: 'id_plan_docente',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanDocente.hasMany(models.PlanEstudiante, {
            as: 'plan_estudiante',
            foreignKey: 'id_plan_docente',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return PlanDocente;
    
};