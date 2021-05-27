'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Sexo = sequelize.define('Sexo', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    }, {       
        tableName: 'sexo',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Sexo.associate = function(models) {
        Sexo.hasMany(models.Persona, {
            as: 'persona',
            foreignKey: 'id_sexo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Sexo;
    
};