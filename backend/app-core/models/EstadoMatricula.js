'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const EstadoMatricula = sequelize.define('EstadoMatricula', {
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
        tableName: 'estado_matricula',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    EstadoMatricula.associate = function(models) {
        EstadoMatricula.hasMany(models.Matricula, {
            as: 'matricula',
            foreignKey: 'id_estado_matricula',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return EstadoMatricula;
    
};