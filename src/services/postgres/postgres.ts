import Knex from 'knex';

require('dotenv').config();

const db = Knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }
});

async function dbInit(): Promise<void> {
    try {
        console.log('Database connection initialized.');
    } catch (error) {
        console.error('Error initializing database connection:', error);
    }
}

async function dbClose(): Promise<void> {
    try {
        console.log(`Closing database connection ...`);
        await db.destroy();
        console.log('Database connection closed successfully.');
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
}

export { db, dbInit, dbClose };
