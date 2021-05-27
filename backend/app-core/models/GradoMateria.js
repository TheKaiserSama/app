'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const GradoMateria = sequelize.define('GradoMateria', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        vigente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        id_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_grado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_materia: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'grado_materia',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    GradoMateria.associate = function(models) {
        GradoMateria.belongsTo(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        GradoMateria.belongsTo(models.Grado, {
            as: 'grado',
            foreignKey: 'id_grado',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        GradoMateria.belongsTo(models.Materia, {
            as: 'materia',
            foreignKey: 'id_materia',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return GradoMateria;
    
};