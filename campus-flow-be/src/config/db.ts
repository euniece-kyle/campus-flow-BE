import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456', // Change this to 123456
    database: 'campus_flow',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;