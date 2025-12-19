// routes/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User registration & airtime
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered with airtime wallet
 *       500:
 *         description: Duplicate phone or DB error
 */
router.post('/', async (req, res) => {
  const { name, phone_number } = req.body;

  if (!name || !phone_number) {
    return res.status(400).json({ error: "name and phone_number required" });
  }

  try {
    await pool.query(
      'INSERT INTO users (phone_number, name) VALUES ($1, $2)',
      [phone_number, name]
    );

    await pool.query(
      'INSERT INTO airtime_balance (phone_number, balance) VALUES ($1, 0)',
      [phone_number]
    );

    res.json({ message: "User registered", phone_number, name, balance: 0 });
  } catch (err) {
    res.status(500).json({ error: "Duplicate phone or DB error" });
  }
});

/**
 * @swagger
 * /users/{phone}/balance:
 *   get:
 *     summary: Check airtime balance
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns airtime balance
 *       404:
 *         description: User not found
 */
router.get('/:phone/balance', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT balance FROM airtime_balance WHERE phone_number=$1',
      [req.params.phone]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ phone: req.params.phone, balance: result.rows[0].balance });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * @swagger
 * /users/{phone}/topup:
 *   post:
 *     summary: Top up airtime
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Airtime topped up
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid amount
 */
router.post('/:phone/topup', async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0)
    return res.status(400).json({ error: "invalid amount" });

  try {
    const result = await pool.query(
      'UPDATE airtime_balance SET balance = balance + $1 WHERE phone_number=$2 RETURNING balance',
      [amount, req.params.phone]
    );

    if (!result.rows.length)
      return res.status(404).json({ error: "User not found" });

    res.json({ phone: req.params.phone, balance: result.rows[0].balance });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
