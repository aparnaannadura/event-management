const pool = require('../config/db');
const dayjs = require('dayjs');
exports.createEvent = async (req, res) => {
  const { title, datetime, location, capacity } = req.body;
  if (!title || !datetime || !location || !capacity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (capacity <= 0 || capacity > 1000) {
    return res.status(400).json({ error: 'Capacity must be between 1 and 1000' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO events (title, datetime, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, datetime, location, capacity]
    );
    res.status(201).json({ eventId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getEventDetails = async (req, res) => {
  const eventId = req.params.id;
  try {
    const eventResult = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
    if (eventResult.rows.length === 0) return res.status(404).json({ error: 'Event not found' });

    const usersResult = await pool.query(
      `SELECT u.id, u.name, u.email FROM users u
       JOIN registrations r ON u.id = r.user_id
       WHERE r.event_id = $1`, [eventId]);

    res.json({ event: eventResult.rows[0], registeredUsers: usersResult.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.registerUser = async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
    if (event.rows.length === 0) return res.status(404).json({ error: 'Event not found' });

    const now = new Date();
    if (new Date(event.rows[0].datetime) < now) {
      return res.status(400).json({ error: 'Cannot register for past events' });
    }

    const checkDuplicate = await pool.query(
      `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`, [userId, eventId]);
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const count = await pool.query(`SELECT COUNT(*) FROM registrations WHERE event_id = $1`, [eventId]);
    if (parseInt(count.rows[0].count) >= event.rows[0].capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }

    await pool.query(`INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)`, [userId, eventId]);
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.cancelRegistration = async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    const result = await pool.query(
      `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *`,
      [userId, eventId]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'User was not registered for this event' });
    }
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getUpcomingEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM events 
      WHERE datetime > NOW()
      ORDER BY datetime ASC, location ASC
    `);
    res.json({ events: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getEventStats = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await pool.query(`SELECT capacity FROM events WHERE id = $1`, [eventId]);
    if (event.rows.length === 0) return res.status(404).json({ error: 'Event not found' });

    const count = await pool.query(`SELECT COUNT(*) FROM registrations WHERE event_id = $1`, [eventId]);
    const total = parseInt(count.rows[0].count);
    const capacity = event.rows[0].capacity;

    res.json({
      totalRegistrations: total,
      remainingCapacity: capacity - total,
      percentUsed: ((total / capacity) * 100).toFixed(2) + '%'
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
