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

// FIXED: Added users route to save logged-in user data to MySQL
flowRouter.post('/users', async (c) => {
  try {
    const user = await c.req.json();
    const query = `INSERT INTO users (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)`;
    await db.execute(query, [user.username, user.firstName, user.lastName, user.email, user.password]);
    return c.json({ success: true, message: 'User saved' });
  } catch (error) {
    console.error('User Save Error:', error);
    return c.json({ error: 'Failed to save user' }, 400);
  }
});

// FIXED: Added subjects route to fix "Failed to add subject" console error
flowRouter.post('/subjects', async (c) => {
  try {
    const { name } = await c.req.json();
    await db.execute('INSERT INTO departments (name) VALUES (?)', [name]);
    return c.json({ success: true, message: 'Subject added' });
  } catch (error) {
    console.error('Subject Error:', error);
    return c.json({ error: 'Database error adding subject' }, 500);
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