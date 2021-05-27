'use strict'

module.exports = (sequelize, DataTypes) => {

    const Consolidado = sequelize.define('Consolidado', {
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
        id_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_curso: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_director_grupo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_periodo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {       
        tableName: 'consolidado',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Consolidado.associate = function(models) {
        Consolidado.hasMany(models.ConsolidadoEstudiante, {
            as: 'consolidado_estudiante',
            foreignKey: 'id_consolidado',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Consolidado.belongsTo(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Consolidado.belongsTo(models.Curso, {
            as: 'curso',
            foreignKey: 'id_curso',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Consolidado.belongsTo(models.DirectorGrupo, {
            as: 'director_grupo',
            foreignKey: 'id_director_grupo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Consolidado.belongsTo(models.Periodo, {
            as: 'periodo',
            foreignKey: 'id_periodo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Consolidado;
};