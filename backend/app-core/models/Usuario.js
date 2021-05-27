'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const Usuario = sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ultima_sesion: {
            type: DataTypes.DATE
        },
        fecha_creacion: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURRENT_DATE')
        },
        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_persona: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'usuario',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    Usuario.associate = function(models) {
        Usuario.belongsTo(models.Persona, {
            as: 'persona',
            foreignKey: 'id_persona',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Usuario.belongsTo(models.Rol, {
            as: 'rol',
            foreignKey: 'id_rol',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return Usuario;
    
};