import { Context } from 'hono';
import { db, db as pool } from '../config/db';

export const getDashboardStats = async (c: Context) => {
  try {
    // 1. Get Total Subjects
    const [subjectRows]: any = await pool.execute('SELECT COUNT(*) as total FROM subjects');
    
    // 2. Get Active Bookings
    const [bookingRows]: any = await db.execute('SELECT COUNT(*) as total FROM bookings');
    
    // FIXED: [feature] Added query to get real room count for availability logic
    const [roomRows]: any = await db.execute('SELECT COUNT(*) as total FROM rooms');

    const totalRooms = roomRows[0].total || 0;
    const totalBookings = bookingRows[0].total || 0;

    return c.json({
      totalSubjects: subjectRows[0].total,
      totalBookings: totalBookings,
      totalRooms: totalRooms,
      // FIXED: [logic] Calculate availability for the dashboard card
      availableNow: totalRooms - totalBookings 
    });
  } catch (error) {
    console.error('Database Error in Stats:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
};