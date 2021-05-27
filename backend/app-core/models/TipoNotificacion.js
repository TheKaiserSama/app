'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const TipoNotificacion = sequelize.define('TipoNotificacion', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type:  DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    }, {       
        tableName: 'tipo_notificacion',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    TipoNotificacion.associate = function(models) {
        TipoNotificacion.hasMany(models.Notificacion, {
            as: 'notificacion',
            foreignKey: 'id_tipo_notificacion',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return TipoNotificacion;
    
};