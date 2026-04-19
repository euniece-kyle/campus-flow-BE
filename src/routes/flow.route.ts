import { Hono } from 'hono';
import { pool } from '../config/db';

const flowRouter = new Hono();

// GET users for the 'Booked By' dropdown
flowRouter.get('/users', async (c) => {
  try {
    const [rows]: any = await pool.query('SELECT username FROM users');
    return c.json(rows); 
  } catch (error) {
    return c.json({ error: 'Database connection failed' }, 500);
  }
}); 

// POST new booking - Matches your phpMyAdmin schema exactly
flowRouter.post('/create', async (c) => {
  const body = await c.req.json();
  const { room, date, period, bookedBy, bookingType, untilDate } = body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (room_id, booking_date, period, booked_by, booking_type, until_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        room, 
        date, 
        period, 
        bookedBy, 
        bookingType || 'One-Time', 
        untilDate || null, 
        'Confirmed' 
      ]
    );
    return c.json({ success: true, message: 'Booking saved to MySQL!' });
  } catch (error) {
    console.error('Insert Error:', error);
    return c.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

export default flowRouter;