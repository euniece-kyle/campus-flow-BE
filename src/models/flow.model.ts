import { pool } from '../config/db';

export const FlowModel = {
    getAllBookings: async () => {
        const [rows] = await pool.execute('SELECT * FROM bookings');
        return rows;
    },

    createBooking: async (data: any) => {
        const { room_name, booking_date, period, subject, booked_by } = data;

        // SQL MATCH: room_name and subject must exist in phpMyAdmin
        const sql = `INSERT INTO bookings (room_name, booking_date, period, subject, booked_by) 
                     VALUES (?, ?, ?, ?, ?)`;

        const [result] = await pool.execute(sql, [
            room_name, 
            booking_date, 
            period, 
            subject, 
            booked_by
        ]);
        
        return result;
    },

    getAllUsers: async () => {
        const [rows] = await pool.query('SELECT username, email FROM users'); 
        return rows;
    }
};