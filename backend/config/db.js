const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_portal',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDB() {
  try {
    // Connect without selecting DB to ensure DB exists
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
    });

    await tempConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'student_portal'}\``
    );
    await tempConnection.end();

    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        register_number VARCHAR(30) NOT NULL UNIQUE,
        phone VARCHAR(15) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if table has records, if not seed initial demo records matching Stitch designs
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM students');
    if (rows[0].count === 0) {
      const sampleStudents = [
        [
          'Aarav Sharma',
          'Computer Science Engineering',
          'CSE2022045',
          '+91 98765 43210',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
        ],
        [
          'Priya Venkat',
          'Information Technology',
          'IT2022108',
          '+91 98412 87854',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        ],
        [
          'Rohan Deshmukh',
          'Electronics and Communication Engineering',
          'ECE2021034',
          '+91 97123 45678',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        ],
        [
          'Ananya Iyer',
          'Mechanical Engineering',
          'ME2023019',
          '+91 98234 56789',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        ],
      ];

      for (const student of sampleStudents) {
        await pool.query(
          'INSERT INTO students (name, department, register_number, phone, image_url) VALUES (?, ?, ?, ?, ?)',
          student
        );
      }
      console.log('🌱 Seeded 4 initial student records matching Stitch reference.');
    }

    console.log('✅ Database connected and verified.');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

module.exports = { pool, initDB };
