import { Hono } from 'hono';
import { db } from '../config/db'; // Ensure this points to your database connection file

const flowRouter = new Hono();

// 1. GET all bookings - Fetches data for the grid and charts
flowRouter.get('/bookings', async (c) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bookings');
    return c.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// 2. GET all users - Fixes the 404 error and populates "Booked By"
flowRouter.get('/users', async (c) => {
  try {
    const [rows] = await db.execute('SELECT username FROM users');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// 3. GET all subjects - Fixes the 404 error for subjects
flowRouter.get('/subjects', async (c) => {
  try {
    const [rows] = await db.execute('SELECT name FROM departments'); 
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Failed to fetch subjects' }, 500);
  }
});

// 4. POST a new booking
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