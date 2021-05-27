'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const EstadoAnioLectivo = sequelize.define('EstadoAnioLectivo', {
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
        tableName: 'estado_anio_lectivo',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    EstadoAnioLectivo.associate = function(models) {
        EstadoAnioLectivo.hasMany(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_estado_anio_lectivo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return EstadoAnioLectivo;
    
};