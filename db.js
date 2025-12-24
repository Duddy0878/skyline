
const mysql = require('mysql2');

const pool = mysql.createPool({
  host:  '127.0.0.1',
  port: 3306,
  user:  'root',
  password:  'Duddy0878',
  database:  'small material',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certs from Aiven
    minVersion: 'TLSv1.2'
  }
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    console.log('Connection config used:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certs from Aiven
    minVersion: 'TLSv1.2'
  }
    });
  } else {
    console.log('Database connected successfully');
    connection.release();
  }
});

const promisePool = pool.promise();

// Add error handler for the promise pool
promisePool.on('error', err => {
  console.error('Database pool error:', err);
});

module.exports = promisePool;