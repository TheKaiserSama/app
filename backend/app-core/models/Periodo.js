'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Periodo = sequelize.define('Periodo', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_finalizacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        id_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'periodo',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Periodo.associate = function(models) {
        Periodo.belongsTo(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Periodo.hasMany(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_periodo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Periodo.hasMany(models.Boletin, {
            as: 'boletin',
            foreignKey: 'id_periodo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Periodo;
    
};