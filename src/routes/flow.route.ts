import { Hono } from 'hono';
import { db as pool } from '../config/db'; // Using the alias fix we discussed

const flowRouter = new Hono();

/* --- SUBJECTS ENDPOINTS --- */

// 1. Get all subjects
flowRouter.get('/subjects', async (c) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects ORDER BY name ASC');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Database error' }, 500);
  }
});

// 2. Add new subject
flowRouter.post('/subjects', async (c) => {
  try {
    const { name } = await c.req.json();
    await pool.query('INSERT INTO subjects (name) VALUES (?)', [name]);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to add subject' }, 500);
  }
});

// 3. Delete subject
flowRouter.delete('/subjects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Delete failed' }, 500);
  }
});

// 4. Update subject
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

/* --- BOOKINGS & DASHBOARD ENDPOINTS --- */

// 5. Get all bookings (For the grid and dashboard)
flowRouter.get('/bookings', async (c) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

// 6. Delete/Cancel booking
flowRouter.delete('/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Cancel failed' }, 500);
  }
});

// 7. Get Stats for Dashboard
flowRouter.get('/stats', async (c) => {
  try {
    const [bookings]: any = await pool.query('SELECT COUNT(*) as count FROM bookings');
    const [subjects]: any = await pool.query('SELECT COUNT(*) as count FROM subjects');
    return c.json({
      totalBookings: bookings[0].count,
      totalSubjects: subjects[0].count
    });
  } catch (error) {
    return c.json({ error: 'Stats failed' }, 500);
  }
});

/* --- USERS ENDPOINT --- */
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

    // Fetch the updated user to send back to frontend
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

export default flowRouter;