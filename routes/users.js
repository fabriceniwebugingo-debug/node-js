const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         phone:
 *           type: string
 *           description: User's phone number (primary key)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * @swagger
 * /users/{phone}:
 *   get:
 *     summary: Get a user by phone number
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: Phone number of the user
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:phone', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE phone_number=$1',
      [req.params.phone]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: Phone number already exists
 */
router.post('/', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });

  try {
    const result = await pool.query(
      'INSERT INTO users (phone_number, name) VALUES ($1, $2) RETURNING *',
      [phone, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Phone already exists' });
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
