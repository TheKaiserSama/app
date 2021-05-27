'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const TipoDocumento = sequelize.define('TipoDocumento', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    }, {       
        tableName: 'tipo_documento',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    TipoDocumento.associate = function(models) {
        TipoDocumento.hasMany(models.Persona, {
            as: 'persona',
            foreignKey: 'id_tipo_documento',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return TipoDocumento;
    
};