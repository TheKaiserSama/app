'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const EstadoEstudiante = sequelize.define('EstadoEstudiante', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        }
    }, {       
        tableName: 'estado_estudiante',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    EstadoEstudiante.associate = function(models) {
        EstadoEstudiante.hasMany(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estado_estudiante',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return EstadoEstudiante;
    
};