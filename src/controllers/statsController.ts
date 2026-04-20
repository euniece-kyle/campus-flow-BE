import { Context } from 'hono';
import { db, db as pool } from '../config/db'; // FIXED: Importing your existing db connection

export const getDashboardStats = async (c: Context) => {
  try {
    // FIXED: Querying the actual MySQL tables for real-time dashboard data
    const [subjectRows]: any = await pool.execute('SELECT COUNT(*) as total FROM subjects');
    const [bookingRows]: any = await db.execute('SELECT COUNT(*) as total FROM bookings');

    return c.json({
      totalSubjects: subjectRows[0].total,
      totalBookings: bookingRows[0].total
    });
  } catch (error) {
    // FIXED: Added error logging for easier debugging in terminal
    console.error('Database Error in Stats:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
};