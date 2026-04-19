import { Hono } from 'hono';
import { pool } from '../config/db';

const flowRouter = new Hono();

// GET endpoint to fetch usernames for dropdowns
flowRouter.get('/users', async (c) => {
  try {
    const [rows]: any = await pool.query('SELECT username FROM users');
    return c.json(rows); 
  } catch (error) {
    console.error('Database Error:', error);
    return c.json({ error: 'Database connection failed' }, 500);
  }
}); 

// The "Insert" API for saving new bookings to MySQL
flowRouter.post('/create', async (c) => {
  const body = await c.req.json();
  const { room, date, period, subject, bookedBy } = body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (room_name, booking_date, period, subject, booked_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [room, date, period, subject, bookedBy]
    );
    return c.json({ success: true, message: 'Booking saved to MySQL!' });
  } catch (error) {
    console.error('Insert Error:', error);
    
    // FIX: Use a type guard to ensure error has a .message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

export default flowRouter;