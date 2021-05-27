'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const EstudianteLogro = sequelize.define('EstudianteLogro', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nota: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false
        },
        id_logro: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'estudiante_logro',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    EstudianteLogro.associate = function(models) {
        EstudianteLogro.belongsTo(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        EstudianteLogro.belongsTo(models.Logro, {
            as: 'logro',
            foreignKey: 'id_logro',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return EstudianteLogro;
    
};