import { Hono } from 'hono';
// This now matches the 'export const db' in your config/db.ts
import { db } from '../config/db'; 

const flowRouter = new Hono();

// 1. GET all bookings
flowRouter.get('/bookings', async (c) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bookings');
    return c.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// 2. POST a new booking
flowRouter.post('/bookings', async (c) => {
  try {
    const body = await c.req.json();
    const { room_name, booking_date, period, subject, booked_by, booking_type, until_date, status } = body;
    
    const query = `
      INSERT INTO bookings (room_name, booking_date, period, subject, booked_by, booking_type, until_date, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.execute(query, [
      room_name, 
      booking_date, 
      period, 
      subject, 
      booked_by, 
      booking_type, 
      until_date, 
      status || 'Confirmed'
    ]);
    
    return c.json({ success: true, message: 'Booking added successfully' });
  } catch (error) {
    console.error('Insert Error:', error);
    return c.json({ error: 'Failed to add booking' }, 400);
  }
});

// 3. DELETE a booking
flowRouter.delete('/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await db.execute('DELETE FROM bookings WHERE id = ?', [id]);
    return c.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    return c.json({ error: 'Delete failed' }, 500);
  }
});

export default flowRouter;