import { Hono } from 'hono';
import { FlowController } from '../controllers/flow.controller';

const flowRouter = new Hono();

flowRouter.get('/list', FlowController.getStats);
flowRouter.post('/add', FlowController.postBooking);

export default flowRouter;