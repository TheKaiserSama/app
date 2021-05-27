'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Logro = sequelize.define('Logro', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        porcentaje: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            defaultValue: 't'
        },
        id_plan_docente: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'logro',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Logro.associate = function(models) {
        Logro.hasMany(models.EstudianteLogro, {
            as: 'estudiante_logro',
            foreignKey: 'id_logro',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Logro.belongsTo(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_plan_docente',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Logro.hasMany(models.Actividad, {
            as: 'actividad',
            foreignKey: 'id_logro',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Logro;
    
};