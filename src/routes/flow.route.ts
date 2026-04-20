import { Hono } from 'hono';
import { db } from '../config/db';

const flowRouter = new Hono();

// Inside campus-flow-BE/src/routes/flow.route.ts
flowRouter.get('/users', async (c) => {
  try {
    const [rows] = await db.query('SELECT username FROM users');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// 1. GET ALL SUBJECTS (For the dropdown)
flowRouter.get('/subjects', async (c) => {
  try {
    const [rows] = await db.query('SELECT name FROM subjects ORDER BY name ASC');
    return c.json(rows);
  } catch (error) {
    console.error('MySQL Subjects Error:', error);
    return c.json({ error: 'Failed to fetch subjects' }, 500);
  }
});

// 2. GET ALL BOOKINGS (For the Grid and Dashboard)
flowRouter.get('/bookings', async (c) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings');
    return c.json(rows);
  } catch (error) {
    console.error('MySQL Bookings Error:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

// 3. POST NEW BOOKING (Saving to MySQL)
flowRouter.post('/bookings', async (c) => {
  try {
    const body = await c.req.json();
    const { room_name, booking_date, period, subject, booked_by, booking_type, status } = body;

    const [result] = await db.query(
      `INSERT INTO bookings (room_name, booking_date, period, subject, booked_by, booking_type, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [room_name, booking_date, period, subject, booked_by, booking_type, status || 'Confirmed']
    );

    return c.json({ id: (result as any).insertId, ...body }, 201);
  } catch (error) {
    console.error('MySQL Save Error:', error);
    return c.json({ error: 'Failed to save booking' }, 500);
  }
});

export default flowRouter;