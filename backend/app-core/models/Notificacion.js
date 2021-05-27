'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    
    const Notificacion = sequelize.define('Notificacion', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        mensaje: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            get: function() {
                return moment(this.getDataValue('fecha')).format('DD-MM-YYYY hh:mm A');
            }
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        visto: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        id_tipo_notificacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_plan_docente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_actividad: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {       
        tableName: 'notificacion',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Notificacion.associate = function(models) {
        Notificacion.belongsTo(models.TipoNotificacion, {
            as: 'tipo_notificacion',
            foreignKey: 'id_tipo_notificacion',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Notificacion.belongsTo(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Notificacion.belongsTo(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_plan_docente',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Notificacion.belongsTo(models.Actividad, {
            as: 'actividad',
            foreignKey: 'id_actividad',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Notificacion;
    
};