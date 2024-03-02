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


  // import { Knex } from 'knex';
// import dotenv from 'dotenv';

// dotenv.config();

// interface ConnectionConfig {
//     host: string;
//     port: number;
//     user: string;
//     password: string;
//     database: string;
//     pool: { min: number; max: number };
// }

// const connection: ConnectionConfig = {
//     host: process.env.DB_HOST || '',
//     port: Number(process.env.DB_PORT) || 5432,
//     user: process.env.DB_USER || '',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || '',
//     pool: { min: 0, max: 10 } // Adjust pool size as needed
// };

// let db: Knex;

// async function dbInit(): Promise<void> {
//     try {
//         db = require('knex')({
//             client: 'pg',
//             connection
//         });

//         const databaseExists = await db.raw(`SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = ?)`, [process.env.DB_NAME]);
//         if (!databaseExists.rows[0].exists) {
//             await db.raw('CREATE DATABASE ??', [process.env.DB_NAME]);
//         }

//         console.log('Database initialized successfully.');
//     } catch (error) {
//         console.error('Error initializing database:', error);
//     }
// }

// async function dbClose(): Promise<void> {
//     try {
//         if (db) {
//             await db.destroy();
//             console.log('Database connection closed successfully.');
//         } else {
//             console.warn('No active database connection to close.');
//         }
//     } catch (error) {
//         console.error('Error closing database connection:', error);
//     }
// }

// export {
//     dbInit, 
//     dbClose, 
//     db 
// };