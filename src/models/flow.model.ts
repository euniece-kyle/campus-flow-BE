import { pool } from '../config/db';

export const FlowModel = {
    getAllBookings: async () => {
        const [rows] = await pool.execute('SELECT * FROM bookings');
        return rows;
    },

    createBooking: async (data: any) => {
        const { room_name, booking_date, period, department, booked_by } = data;
        const sql = `INSERT INTO bookings (room_name, booking_date, period, department, booked_by) 
                     VALUES (?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(sql, [room_name, booking_date, period, department, booked_by]);
        return result;
    },

    getAllUsers: async () => {
        const [rows] = await pool.query('SELECT username, email FROM users'); 
        return rows;
    }
};