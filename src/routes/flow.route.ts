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

// POST endpoint to create a booking
flowRouter.post('/create', async (c) => {
  const body = await c.req.json();
  // Destructure the payload from Angular
  const { room, date, period, bookedBy, bookingType, untilDate } = body;

  try {
    // UPDATED SQL: Matches your phpMyAdmin schema exactly
    // room_id = 'SAC 201', booking_date = 'Sunday, April 19, 2026', etc.
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
        'Confirmed' // Matches the 'status' column in your DB
      ]
    );
    
    return c.json({ success: true, message: 'Booking saved to MySQL!' });
  } catch (error) {
    console.error('Insert Error:', error); // Shows the red text in your terminal
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

export default flowRouter;