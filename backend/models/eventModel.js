const pool = require('../config/db')
const createEventTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      datetime TIMESTAMP NOT NULL,
      location VARCHAR(255) NOT NULL,
      capacity INTEGER CHECK (capacity > 0 AND capacity <= 1000),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS registrations (
      event_id INT REFERENCES events(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      registered_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (event_id, user_id)
    );
  `)
}

const createEvent = async ({ title, datetime, location, capacity }) => {
  const result = await pool.query(
    'INSERT INTO events (title, datetime, location, capacity) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, datetime, location, capacity]
  )
  return result.rows[0]
}
const getEventDetails = async (eventId) => {
  const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId])
  const users = await pool.query(
    `
      SELECT u.id, u.name, u.email 
      FROM registrations r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.event_id = $1
    `,
    [eventId]
  )
  return { ...event.rows[0], registrations: users.rows }
}
module.exports = {
  createEventTables,
  createEvent,
  getEventDetails,
}
