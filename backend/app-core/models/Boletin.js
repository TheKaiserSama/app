'use strict';

module.exports = (sequelize, DataTypes) => {

    const Boletin = sequelize.define('Boletin', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        observaciones: {
            type: DataTypes.TEXT
        },
        rector: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        coordinador: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_curso: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_periodo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_director_grupo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {       
        tableName: 'boletin',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Boletin.associate = function(models) {
        Boletin.hasMany(models.ValoracionCualitativa, {
            as: 'valoracion_cualitativa',
            foreignKey: 'id_boletin',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Boletin.belongsTo(models.Curso, {
            as: 'curso',
            foreignKey: 'id_curso',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Boletin.belongsTo(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Boletin.belongsTo(models.Periodo, {
            as: 'periodo',
            foreignKey: 'id_periodo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Boletin.belongsTo(models.DirectorGrupo, {
            as: 'director_grupo',
            foreignKey: 'id_director_grupo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Boletin.belongsTo(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Boletin;

};