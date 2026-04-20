import { Context } from 'hono';
import { FlowModel } from '../models/flow.model';

export const FlowController = {
    getStats: async (c: Context) => {
        try {
            const data = await FlowModel.getAllBookings();
            return c.json(data);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    },

    postBooking: async (c: Context) => {
        try {
            const body = await c.req.json();

            const dateObj = new Date(body.booking_date);
            const formattedDate = dateObj.getFullYear() + '-' + 
                                  String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                                  String(dateObj.getDate()).padStart(2, '0');

            const preparedData = {
                room_name: body.room_name,
                booking_date: formattedDate,
                period: body.period,
                subject: body.subject, 
                booked_by: body.booked_by
            };

            const result = await FlowModel.createBooking(preparedData);
            return c.json({ success: true, result }, 201);
        } catch (error: any) {
            console.error("Insert Error:", error);
            return c.json({ error: error.message }, 500);
        }
    },

    fetchUsers: async (c: Context) => {
        try {
            const users = await FlowModel.getAllUsers();
            return c.json(users);
        } catch (error) {
            return c.json({ error: 'Failed to fetch users' }, 500);
        }
    }
};