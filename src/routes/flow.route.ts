import { Hono } from 'hono';
import { pool } from '../config/db';

const flowRouter = new Hono();

flowRouter.get('/users', async (c) => {
  try {
    const [rows]: any = await pool.query('SELECT username FROM users');
    return c.json(rows); 
  } catch (error) {
    return c.json({ error: 'Database connection failed' }, 500);
  }
}); 

flowRouter.post('/create', async (c) => {
  const body = await c.req.json();
  const { room, date, period, subject, bookedBy } = body;

  try {
    // RESTORED: Using 'room_name' and 'booking_date' to match your classmate's DB
    const [result] = await pool.query(
      `INSERT INTO bookings (room_name, booking_date, period, subject, booked_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [room, date, period, subject, bookedBy]
    );
    return c.json({ success: true, message: 'Booking saved to MySQL!' });
  } catch (error) {
    console.error('Insert Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

export default flowRouter;