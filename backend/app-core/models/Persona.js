'use strict';
const hooks = require('../../app-api/helpers/hooks');

module.exports = (sequelize, DataTypes) => {
    
    const Persona = sequelize.define('Persona', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        documento: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
            // comment: 'Numero de identificacion de una persona'
        },
        primer_nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        segundo_nombre: {
            type: DataTypes.TEXT
        },
        primer_apellido: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        segundo_apellido: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        numero_telefono: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        numero_celular: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_documento: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_municipio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_sexo: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        freezeTableName: true,
        tableName: 'persona',
        timestamps: false,
        underscored: true,
        schema: 'public',
        // modelName: 'persona',
        // name: {
        //     singular: 'persona',
        //     plural: 'personas',
        // }
    });

    Persona.associate = function(models) {
        Persona.belongsTo(models.Municipio, {
            as: 'municipio',
            foreignKey: 'id_municipio',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Persona.belongsTo(models.TipoDocumento, {
            as: 'tipo_documento',
            foreignKey: 'id_tipo_documento',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Persona.belongsTo(models.Sexo, {
            as: 'sexo',
            foreignKey: 'id_sexo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Persona.hasOne(models.Usuario, { // Posiblemente cambiar por hasMany (hasOne no soporta sourceKey: '')
            as: 'usuario',
            foreignKey: 'id_persona',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Persona.hasMany(models.Docente, {
            as: 'docente',
            foreignKey: 'id_persona',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Persona.hasMany(models.Estudiante, {
            as: 'estudiante',
            foreignKey: 'id_persona',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        Persona.belongsTo(models.Rol, {
            as: 'rol',
            foreignKey: 'id_rol',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    Persona.addHook('beforeCreate', (persona, options) => {
        persona.primer_nombre = hooks.capitalize(persona.primer_nombre);
        persona.segundo_nombre = hooks.capitalize(persona.segundo_nombre);
        persona.primer_apellido = hooks.capitalize(persona.primer_apellido);
        persona.segundo_apellido = hooks.capitalize(persona.segundo_apellido);
    });

    Persona.addHook('beforeBulkUpdate', ({ attributes }) => {
        attributes.primer_nombre = hooks.capitalize(attributes.primer_nombre);
        attributes.segundo_nombre = hooks.capitalize(attributes.segundo_nombre);
        attributes.primer_apellido = hooks.capitalize(attributes.primer_apellido);
        attributes.segundo_apellido = hooks.capitalize(attributes.segundo_apellido);
    });

    return Persona;
    
};
