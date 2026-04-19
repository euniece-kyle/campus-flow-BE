import { pool } from '../config/db';

export const FlowModel = {
    getAllBookings: async () => {
        const [rows] = await pool.execute('SELECT * FROM bookings');
        return rows;
    },

    createBooking: async (data: any) => {
        const query = `
            INSERT INTO bookings (room_name, booking_date, period, subject, booked_by, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [
            data.room_name, 
            data.booking_date, 
            data.period, 
            data.subject, 
            data.booked_by, 
            'Confirmed'
        ];
        const [result] = await pool.execute(query, params);
        return result;
    },

    getAllUsers: async () => {
        const [rows] = await pool.execute('SELECT id, firstName, lastName, email FROM users');
        return rows;
    }
};