import { Pool } from 'pg';
import Knex from 'knex';

require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const db = Knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    pool: {
        min: 2, 
        max: 100, 
    },
});

async function dbInit(): Promise<void> {
    try {
        await pool.connect();
        console.log('Database connection pool initialized.');
    } catch (error) {
        console.error('Error initializing database connection pool:', error);
    }
}

async function dbClose(): Promise<void> {
    try {
        console.log(`Closing ( ${ pool.totalCount } ) database connection pools...`);
        
        await pool.end();
        console.log('Database connection pool closed successfully.');
    } catch (error) {
        console.error('Error closing database connection pool:', error);
    }
}

export { db, dbInit, dbClose };