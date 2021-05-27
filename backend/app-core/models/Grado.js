'use strict'
module.exports = (sequelize, DataTypes) => {

    const Grado = sequelize.define('Grado', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        grado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {       
        tableName: 'grado',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Grado.associate = function(models) {
        Grado.hasMany(models.Curso, {
            as: 'curso',
            foreignKey: 'id_grado',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Grado.hasMany(models.GradoMateria, {
            as: 'grado_materia',
            foreignKey: 'id_grado',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Grado;

}