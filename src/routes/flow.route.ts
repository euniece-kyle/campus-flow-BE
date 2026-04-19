import { Hono } from 'hono';
import { pool } from '../config/db';

const flowRouter = new Hono();

// GET all bookings for the Dashboard
flowRouter.get('/all-bookings', async (c) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, room_name, booking_date, period, subject, booked_by, booking_type, until_date, status FROM bookings'
    );
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Database fetch failed' }, 500);
  }
});

// GET users for the 'Booked By' dropdown
flowRouter.get('/users', async (c) => {
  try {
    const [rows]: any = await pool.query('SELECT username FROM users');
    return c.json(rows); 
  } catch (error) {
    return c.json({ error: 'Database connection failed' }, 500);
  }
}); 

// POST new booking - Fully synchronized with your professional DB
flowRouter.post('/create', async (c) => {
  const body = await c.req.json();
  // Using 'subject' from your frontend form
  const { room, date, period, bookedBy, bookingType, untilDate, subject } = body;

  try {
    // Converts "Sunday, April 19, 2026" into "2026-04-19"
    const dateObj = new Date(date);
    const formattedDate = dateObj.getFullYear() + '-' + 
                          String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(dateObj.getDate()).padStart(2, '0');

    const [result] = await pool.query(
      `INSERT INTO bookings (room_name, booking_date, period, subject, booked_by, booking_type, until_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        room, 
        formattedDate, 
        period, 
        subject || 'General', 
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