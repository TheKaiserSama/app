'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const AnioLectivo = sequelize.define('AnioLectivo', {
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
        anio_actual: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        id_estado_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_rango: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'anio_lectivo',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    AnioLectivo.associate = function(models) {
        AnioLectivo.belongsTo(models.EstadoAnioLectivo, {
            as: 'estado_anio_lectivo',
            foreignKey: 'id_estado_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        AnioLectivo.belongsTo(models.Rango, {
            as: 'rango',
            foreignKey: 'id_rango',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        AnioLectivo.hasMany(models.Curso, {
            as: 'curso',
            foreignKey: 'id_anio_lectivo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        AnioLectivo.hasMany(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_anio_lectivo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        AnioLectivo.hasMany(models.Periodo, {
            as: 'periodo',
            foreignKey: 'id_anio_lectivo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        AnioLectivo.hasMany(models.Matricula, {
            as: 'matricula',
            foreignKey: 'id_anio_lectivo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        AnioLectivo.hasMany(models.DirectorGrupo, {
            as: 'director_grupo',
            foreignKey: 'id_anio_lectivo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        AnioLectivo.hasMany(models.Boletin, {
            as: 'boletin',
            foreignKey: 'id_anio_lectivo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return AnioLectivo;
    
};