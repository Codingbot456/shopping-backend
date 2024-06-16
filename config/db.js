require('dotenv').config();
const mysql = require('mysql2');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
    connectionLimit: 10, // Adjust as per your application needs
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Add the port here
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Check if the pool is successfully created
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
        console.error('Error connecting to the database:', err.message);
    }
    if (connection) {
        connection.release(); // Release the connection
        console.log('Connected to the database as id', connection.threadId);
    }
    return;
});

module.exports = pool.promise(); // Export the pool for using async/await
