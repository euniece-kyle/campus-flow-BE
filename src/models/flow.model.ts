import { pool } from '../config/db';

export const FlowModel = {
    getAllBookings: async () => {
        const [rows] = await pool.execute('SELECT * FROM bookings');
        return rows;
    },

    createBooking: async (data: any) => {
        // These keys must match the ones we defined in the controller
        const { room_name, booking_date, period, subject, booked_by } = data;

        // SQL using the exact column names from your latest phpMyAdmin screenshot
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