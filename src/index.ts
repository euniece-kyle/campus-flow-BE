import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import flowRouter from './routes/flow.route';
// FIXED: Imported db connection to handle dashboard statistics queries
import { db as pool } from './config/db'; 

const app = new Hono();

app.use('/*', cors());

app.get('/', (c) => c.text('CampusFlow API is Running!'));

// FIXED: Added /api/stats endpoint before flowRouter to handle dashboard data requests
app.get('/api/stats', async (c) => {
  try {
    // FIXED: Fetching real-time counts from MySQL for the Dashboard cards
    const [subjectRows]: any = await pool.execute('SELECT COUNT(*) as total FROM subjects');
    const [bookingRows]: any = await pool.execute('SELECT COUNT(*) as total FROM bookings');

    return c.json({
      totalSubjects: subjectRows[0].total,
      totalBookings: bookingRows[0].total
    });
  } catch (error) {
    console.error('Stats Error:', error);
    return c.json({ error: 'Failed to fetch dashboard stats' }, 500);
  }
});

app.route('/api', flowRouter);

const port = 3000;
console.log(`Server is starting...`);

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`);
});

export default app;