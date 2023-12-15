const pgp = require('pg-promise')({
    capSQL: true
  });
  
  const connectionString = {
    host: process.env.PSQL_HOST,
    port: process.env.PSQL_PORT,
    database: process.env.PSQL_DB_NAME,
    user: process.env.PSQL_USER_NAME,
    password: process.env.PSQL_PASSWORD
  }
  console.log("connection string",connectionString)
  const pool = pgp(connectionString)
  module.exports = { pool, pgp }
  