'use strict'
module.exports = (sequelize, DataTypes) => {

    const Grupo = sequelize.define('Grupo', {
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
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {      
        tableName: 'grupo',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Grupo.associate = function(models) {
        Grupo.hasMany(models.Curso, {
            as: 'curso',
            foreignKey: 'id_grupo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Grupo;

}