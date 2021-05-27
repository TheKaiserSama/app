'use strict'

module.exports = (sequelize, DataTypes) => {

    const ConsolidadoEstudiante = sequelize.define('ConsolidadoEstudiante', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        observaciones: {
            type: DataTypes.TEXT
        },
        id_consolidado: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_estudiante: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {       
        tableName: 'consolidado_estudiante',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    ConsolidadoEstudiante.associate = function(models) {
        ConsolidadoEstudiante.belongsTo(models.Consolidado, {
            as: 'consolidado',
            foreignKey: 'id_consolidado',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        ConsolidadoEstudiante.belongsTo(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_estudiante',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return ConsolidadoEstudiante;

};