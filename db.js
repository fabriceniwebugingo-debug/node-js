// db.js
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "customers",
  user: "postgres",
  password: "1234",
});

async function migrate() {
  try {
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS main_category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sub_category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        main_id INT REFERENCES main_category(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS period (
        id SERIAL PRIMARY KEY,
        label VARCHAR(20) NOT NULL,
        sub_id INT REFERENCES sub_category(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS quantity_price (
        id SERIAL PRIMARY KEY,
        quantity NUMERIC(12,2) NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        period_id INT REFERENCES period(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS purchased_bundles (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(20) REFERENCES users(phone_number),
        quantity_price_id INT REFERENCES quantity_price(id),
        remaining NUMERIC(12,2) NOT NULL,
        purchase_date TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("📌 Database migrations completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  }
}

migrate();

module.exports = pool;
