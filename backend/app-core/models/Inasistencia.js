'use strict';
const moment = require('moment');
const { getCurrentTime } = require('../../app-api/helpers/date');

module.exports = (sequelize, DataTypes) => {
    
    const Inasistencia = sequelize.define('Inasistencia', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            get() {
                return moment(this.getDataValue('fecha')).format('YYYY-MM-DD hh:mm A');
            },
            set(value) {
                return this.setDataValue('fecha', moment(`${ value } ${ getCurrentTime() }`));
            }
        },
        justificado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        id_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_plan_docente: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'inasistencia',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Inasistencia.associate = function(models) {
        Inasistencia.belongsTo(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Inasistencia.belongsTo(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_plan_docente',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Inasistencia;
    
};