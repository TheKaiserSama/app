'use strict';
module.exports = (sequelize, DataTypes) => {
    
    const DirectorGrupo = sequelize.define('DirectorGrupo', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        id_anio_lectivo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_docente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_curso: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {       
        tableName: 'director_grupo',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public'
    });

    DirectorGrupo.associate = function(models) {
        DirectorGrupo.belongsTo(models.AnioLectivo, {
            as: 'anio_lectivo',
            foreignKey: 'id_anio_lectivo',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        DirectorGrupo.belongsTo(models.Curso, {
            as: 'curso',
            foreignKey: 'id_curso',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        DirectorGrupo.belongsTo(models.Docente, {
            as: 'docente',
            foreignKey: 'id_docente',
            targetKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
        DirectorGrupo.hasMany(models.Boletin, {
            as: 'boletin',
            foreignKey: 'id_director_grupo',
            sourceKey: 'id',
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION',
            hooks: true
        });
    };

    return DirectorGrupo;
    
};