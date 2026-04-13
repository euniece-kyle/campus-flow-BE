import { Hono } from 'hono';
import { cors } from 'hono/cors';
import flowRouter from './routes/flow.route';

const app = new Hono();

// ALLOW Angular to talk to Hono
app.use('/*', cors());

app.get('/', (c) => c.text('CampusFlow API is Running!'));

// Route groups
app.route('/api/bookings', flowRouter);

export default app;