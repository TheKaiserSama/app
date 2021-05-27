'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Curso = sequelize.define('Curso', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        id_sede: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_jornada: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_grado: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_grupo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cupo_maximo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cupo_utilizado: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {       
        tableName: 'curso',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Curso.associate = function(models) {
        Curso.belongsTo(models.Jornada, {
            as: 'jornada',
            foreignKey: 'id_jornada',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Curso.belongsTo(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Curso.belongsTo(models.Sede, {
            as: 'sede',
            foreignKey: 'id_sede',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Curso.belongsTo(models.Grado, {
            as: 'grado',
            foreignKey: 'id_grado',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Curso.belongsTo(models.Grupo, {
            as: 'grupo',
            foreignKey: 'id_grupo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Curso.hasMany(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_curso',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Curso.hasMany(models.Matricula, {
            as: 'matricula',
            foreignKey: 'id_curso',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Curso.hasMany(models.DirectorGrupo, {
            as: 'director_grupo',
            foreignKey: 'id_curso',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Curso.hasMany(models.Boletin, {
            as: 'boletin',
            foreignKey: 'id_curso',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Curso;
    
};