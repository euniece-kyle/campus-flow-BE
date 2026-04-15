import { Hono } from 'hono';
import { FlowController } from '../controllers/flow.controller';
import { pool } from '../config/db';
const flowRouter = new Hono();

flowRouter.get('/list', FlowController.getStats);
flowRouter.get('/users', FlowController.fetchUsers);
flowRouter.post('/add', FlowController.postBooking);


export default flowRouter;

flowRouter.get('/all-users', async (c) => {
  try {
    // Change 'db' to 'pool' to match your db.ts file
    const [rows] = await pool.query('SELECT username FROM users');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: 'Database connection failed' }, 500);
  }
});