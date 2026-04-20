import { Hono } from 'hono';
import { db } from '../config/db'; 

const flowRouter = new Hono();

// GET all bookings
flowRouter.get('/bookings', async (c) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bookings');
    return c.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// FIXED: Added users route to populate "Booked By" dropdown
flowRouter.get('/users', async (c) => {
  try {
    const [rows] = await db.execute('SELECT username FROM users');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// FIXED: Added subjects route to fetch dynamic department names
flowRouter.get('/subjects', async (c) => {
  try {
    const [rows] = await db.execute('SELECT name FROM departments'); 
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Failed to fetch subjects' }, 500);
  }
});

// POST a new booking
flowRouter.post('/bookings', async (c) => {
  try {
    const body = await c.req.json();
    const { room_name, booking_date, period, subject, booked_by, booking_type, until_date, status } = body;

    const query = `
      INSERT INTO bookings (room_name, booking_date, period, subject, booked_by, booking_type, until_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [room_name, booking_date, period, subject, booked_by, booking_type, until_date, status || 'Confirmed']);

    return c.json({ success: true, message: 'Booking added successfully' });
  } catch (error) {
    console.error('Insert Error:', error);
    return c.json({ error: 'Failed to add booking' }, 400);
  }
});

export default flowRouter;