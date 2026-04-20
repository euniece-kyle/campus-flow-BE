import { Hono } from 'hono';
import { db as pool } from '../config/db'; 

const flowRouter = new Hono();

flowRouter.get('/subjects', async (c) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects ORDER BY name ASC');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Database error' }, 500);
  }
});

flowRouter.post('/subjects', async (c) => {
  try {
    const { name } = await c.req.json();
    await pool.query('INSERT INTO subjects (name) VALUES (?)', [name]);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to add subject' }, 500);
  }
});

flowRouter.delete('/subjects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Delete failed' }, 500);
  }
});

flowRouter.patch('/subjects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { name } = await c.req.json();
    await pool.query('UPDATE subjects SET name = ? WHERE id = ?', [name, id]);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Update failed' }, 500);
  }
});

flowRouter.post('/bookings', async (c) => {
  try {
    const body = await c.req.json();
    
    const [result] = await pool.query(
      `INSERT INTO bookings (room_name, booking_date, period, subject, booked_by, booking_type, until_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.room_name, 
        body.booking_date, 
        body.period, 
        body.subject, 
        body.booked_by, 
        body.booking_type, 
        body.until_date, 
        body.status || 'Confirmed'
      ]
    );

    return c.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error('DB Error:', error);
    return c.json({ error: 'Database insertion failed' }, 500);
  }
});

flowRouter.get('/bookings', async (c) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

flowRouter.delete('/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Cancel failed' }, 500);
  }
});

flowRouter.get('/users', async (c) => {
  try {
    const [rows] = await pool.query('SELECT username FROM users');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'User fetch failed' }, 500);
  }
});

flowRouter.patch('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { firstName, lastName } = await c.req.json();
    
    await pool.query(
      'UPDATE users SET firstName = ?, lastName = ? WHERE id = ?',
      [firstName, lastName, id]
    );

    const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return c.json(rows[0]);
  } catch (error) {
    return c.json({ error: 'Update failed' }, 500);
  }
});

flowRouter.patch('/users/:id/password', async (c) => {
  try {
    const id = c.req.param('id');
    const { password } = await c.req.json();
    
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Password update failed' }, 500);
  }
});

flowRouter.get('/stats', async (c) => {
  try {
    const [bookingsCount]: any = await pool.query('SELECT COUNT(*) as total FROM bookings');
    const [subjectsCount]: any = await pool.query('SELECT COUNT(*) as total FROM subjects');
    
    const [distribution]: any = await pool.query(
      'SELECT SUBSTRING_INDEX(room_name, " ", 1) as building, COUNT(*) as count FROM bookings GROUP BY building'
    );

    return c.json({
      totalBookings: bookingsCount[0].total,
      totalSubjects: subjectsCount[0].total,
      activeBookings: bookingsCount[0].total, // Standardized for frontend
      buildingStats: distribution
    });
  } catch (error) {
    console.error('Stats fetch failed:', error);
    return c.json({ error: 'Stats failed' }, 500);
  }
});

export default flowRouter;