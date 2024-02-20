require('dotenv').config();
import Knex from 'knex';

const connection = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

async function dbInit() {
    
    let knex = Knex({
        client: 'pg',
        connection
    });

    const databaseExists = await knex.raw(`SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = ?)`, [process.env.DB_NAME]);
    if (!databaseExists.rows[0].exists) {
        await knex.raw('CREATE DATABASE ??', [process.env.DB_NAME]);
    }

    knex = Knex({
        client: 'pg',
        connection: {
            ...connection,
            database: process.env.DB_NAME,
        }
    });
}

const db = require('knex')({
    client: 'pg',
    connection: {
    host :    process.env.DB_HOST,
    port :    Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD
    }
});

async function dbClose() {
    try {
      // Close the Knex connection
      await db.destroy();
      console.log('Database connection closed successfully.');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
  
  export {
    dbInit,
    db,
    dbClose
  };