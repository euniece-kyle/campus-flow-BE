import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import flowRouter from './routes/flow.route';

const app = new Hono();

app.use('/*', cors());

app.get('/', (c) => c.text('CampusFlow API is Running!'));

app.route('/api', flowRouter);

const port = 3000;
console.log(`Server is starting...`);

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`);
});

export default app;