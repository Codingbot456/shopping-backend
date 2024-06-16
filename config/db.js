require('dotenv').config();
const mysql = require('mysql2');

// Check if environment variables are loaded
if (!process.env.MYSQLHOST || !process.env.MYSQLUSER || !process.env.MYSQLPASSWORD || !process.env.MYSQLDATABASE) {
    console.error('Missing required environment variables. Check your .env file.');
    process.exit(1); // Exit the application if environment variables are missing
}

// Debug: Log environment variables (Optional for debugging)
console.log('MYSQLHOST:', process.env.MYSQLHOST);
console.log('MYSQLPORT:', process.env.MYSQLPORT);
console.log('MYSQLUSER:', process.env.MYSQLUSER);
console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD);
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE);

// Create a pool instead of a single connection
const pool = mysql.createPool({
    connectionLimit: 10, // Adjust as per your application needs
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
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
