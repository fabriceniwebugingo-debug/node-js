const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'customers',
  password: '1234',
  port: 5432,
});

// Auto-create table if missing
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        phone_number VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);
    console.log('users table ready');
  } catch (err) {
    console.error('Migration failed:', err);
  }
})();

module.exports = pool;
