'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const EstadoDocente = sequelize.define('EstadoDocente', {
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
        tableName: 'estado_docente',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    EstadoDocente.associate = function(models) {
        EstadoDocente.hasMany(models.Docente, {
            as: 'docente',
            foreignKey: 'id_estado_docente',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return EstadoDocente;
    
};