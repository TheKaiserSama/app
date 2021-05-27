'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Docente = sequelize.define('Docente', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha_registro: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURRENT_DATE')
        },
        fecha_ingreso: {
            type: DataTypes.DATEONLY
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        codigo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_estado_docente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_persona: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'docente',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Docente.associate = function(models) {
        Docente.belongsTo(models.EstadoDocente, {
            as: 'estado_docente',
            foreignKey: 'id_estado_docente',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Docente.hasMany(models.PlanDocente, {
            as: 'plan_docente',
            foreignKey: 'id_docente',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Docente.belongsTo(models.Persona, {
            as: 'persona',
            foreignKey: 'id_persona',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Docente.hasMany(models.DirectorGrupo, {
            as: 'director_grupo',
            foreignKey: 'id_docente',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Docente;
    
};