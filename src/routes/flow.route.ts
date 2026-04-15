import { Hono } from 'hono';
import { FlowController } from '../controllers/flow.controller';
import { pool } from '../config/db';
const flowRouter = new Hono();

flowRouter.get('/list', FlowController.getStats);
flowRouter.get('/users', FlowController.fetchUsers);
flowRouter.post('/add', FlowController.postBooking);


export default flowRouter;

// Add this into your flow.route.ts file
flowRouter.get('/users', async (c) => {
  try {
    // This query pulls the usernames from your campus_flow database
    const [rows]: any = await pool.query('SELECT username FROM users');
    
    // This returns the exact JSON format you need
    return c.json(rows); 
  } catch (error) {
    console.error('Database Error:', error);
    return c.json({ error: 'Database connection failed' }, 500);
  }
});