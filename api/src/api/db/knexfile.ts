// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require('dotenv').config({ path: '../../../.env' });
module.exports = {
  development: {
    client: process.env.DB_DIALECT,
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: process.env.DB_DIALECT,
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
