'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.resolve(__dirname + '/../../config/database.js'))[env];
const db = {};
const bcrypt = require('bcryptjs');
const { getCurrentDate, formatDate } = require('../../app-api/helpers/date');

let sequelize;
if (config.use_env_variable) {
  	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
.readdirSync(__dirname)
.filter(file => {
  	return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
.forEach(file => {
	const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  	if (db[modelName].associate) {
    	db[modelName].associate(db);
  	}
});

// sequelize.sync({ force: true }).then(() => {
// 	console.log(`Database & tables created!`);
// });

sequelize
.authenticate()
.then(async () => {
	const persona = await db.Persona.findByPk(1);
	if (persona) {
		const usuario = await db.Usuario.findOne({ where: { username: '1111111111' } });
		if (!usuario) {
			await db.Usuario.create({
				username: '1111111111',
				password: bcrypt.hashSync('1111', 10),
				id_persona: 1,
				id_rol: 1,
				fecha_creacion: formatDate(getCurrentDate()),
				ultima_sesion: null
			});
		}
	}
})
.catch(err => {
  	console.error('Unable to connect to the database:', err);
});

db.sequelize = sequelize; // sequelize = Es donde se guarda la conexion, Instancia de Sequelize
db.Sequelize = Sequelize; // Sequelize = Tiene las propiedades y metodos de sequelize (operadores, modelos, ...)

module.exports = db;