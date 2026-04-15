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
            const result = await FlowModel.createBooking(body);
            return c.json({ success: true, result }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    },

    fetchUsers: async (c: Context) => { // Removed 'static' and added 'Context' type
        try {
            const users = await FlowModel.getAllUsers();
            return c.json(users);
        } catch (error) {
            return c.json({ error: 'Failed to fetch users' }, 500);
        }
    }
};