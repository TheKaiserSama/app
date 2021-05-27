'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Municipio = sequelize.define('Municipio', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        id_departamento: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'municipio',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Municipio.associate = function(models) {
        Municipio.belongsTo(models.Departamento, {
            as: 'departamento',
            foreignKey: 'id_departamento',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Municipio.hasMany(models.Persona, {
            as: 'persona',
            foreignKey: 'id_municipio',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Municipio;
    
};