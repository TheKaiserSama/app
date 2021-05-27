'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Matricula = sequelize.define('Matricula', {
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
        vigente: {
            type: DataTypes.BOOLEAN,
            defaultValue: 't'   
        },
        id_estado_matricula: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_curso: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {      
        tableName: 'matricula',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Matricula.associate = function(models) {
        Matricula.belongsTo(models.EstadoMatricula, {
            as: 'estado_matricula',
            foreignKey: 'id_estado_matricula',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Matricula.belongsTo(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Matricula.belongsTo(models.Curso, {
            as: 'curso',
            foreignKey: 'id_curso',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Matricula.belongsTo(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Matricula;
    
};