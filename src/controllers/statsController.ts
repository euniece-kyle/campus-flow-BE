import { Context } from 'hono';
import { db, db as pool } from '../config/db'; 

export const getDashboardStats = async (c: Context) => {
  try {
    // Querying MySQL for dashboard counters
    const [subjectRows]: any = await pool.execute('SELECT COUNT(*) as total FROM subjects');
    const [bookingRows]: any = await db.execute('SELECT COUNT(*) as total FROM bookings');

    return c.json({
      totalSubjects: subjectRows[0].total,
      totalBookings: bookingRows[0].total
    });
  } catch (error) {
    console.error('Database Error in Stats Controller:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
};