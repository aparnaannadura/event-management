const pool = require('../config/db')

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `)
}
const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users ORDER BY id ASC')
  return result.rows
}
const createUser = async (name, email) => {
  const result = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  )
  return result.rows[0]
}
module.exports = {
  createUserTable,
  getAllUsers,
  createUser,
}
