require('dotenv').config();

module.exports = {
    development: {
      	username: process.env.DB_USERNAME,
      	password: process.env.DB_PASSWORD,
      	database: process.env.DB_NAME,
      	host: process.env.DB_HOSTNAME,
		dialect: "postgres",
		port: 5432,
      	migrationStorage: "sequelize",
      	migrationStorageTableName: "sequelize_meta",
      	// operatorsAliases: false, // No es necesario si se establce en falso
      	dialectOptions: {
			// dialect options like SSL etc here
			useUTC: false,
			dateStrings: true,
            typeCast(field, next) {
                // for reading from database
                if (field.type === 'DATETIME') {
                    return field.string();
                }
                return next();
            }
		},
		timezone: 'America/Bogota'
    },
    test: {
      	username: process.env.DB_USERNAME,
      	password: process.env.DB_PASSWORD,
      	database: process.env.DB_NAME,
      	host: process.env.DB_HOSTNAME,
		dialect: "postgres",
		migrationStorage: "sequelize",
      	migrationStorageTableName: "sequelize_meta",
        // operatorsAliases: false,
        dialectOptions: {
			// dialect options like SSL etc here
			useUTC: false,
			dateStrings: true,
            typeCast(field, next) {
                // for reading from database
                if (field.type === 'DATETIME') {
                    return field.string();
                }
                return next();
            }
		},
		timezone: 'America/Bogota'
    },
    production: {
      	username: process.env.DB_USERNAME,
      	password: process.env.DB_PASSWORD,
      	database: process.env.DB_NAME,
      	host: process.env.DB_HOSTNAME,
        dialect: "postgres",
        migrationStorage: "sequelize",
      	migrationStorageTableName: "sequelize_meta",
        // operatorsAliases: false,
        dialectOptions: {
			// dialect options like SSL etc here
			useUTC: false,
			dateStrings: true,
            typeCast(field, next) {
                // for reading from database
                if (field.type === 'DATETIME') {
                    return field.string();
                }
                return next();
            }
		},
		timezone: 'America/Bogota'
    }
}