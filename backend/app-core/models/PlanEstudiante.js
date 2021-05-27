'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const PlanEstudiante = sequelize.define('PlanEstudiante', {
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
        id_plan_docente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'plan_estudiante',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    PlanEstudiante.associate = function(models) {
        PlanEstudiante.belongsTo(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        PlanEstudiante.belongsTo(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_plan_docente',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return PlanEstudiante;
    
};