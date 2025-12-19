// db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'customers',   // your DB name
  user: 'postgres',
  password: '1234'         // change to your password
});

// Run migrations automatically
async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      phone_number VARCHAR(20) PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS airtime_balance (
      phone_number VARCHAR(20) PRIMARY KEY REFERENCES users(phone_number),
      balance NUMERIC(12,2) DEFAULT 0
    );
  `);

  console.log("Tables migrated successfully!");
}

migrate().catch(err => console.error("Migration failed:", err));

module.exports = pool;
