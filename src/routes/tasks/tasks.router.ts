import { Router, Request, Response } from 'express';
import TaskFactory from '../../factory/TaskFactory';

const tasksRouter = Router();

const taskFactory = async () => {
    return await TaskFactory.createInstance();
}

tasksRouter.post('/task/add', async (req: Request, res: Response) => await (await taskFactory()).httpAddTask(req, res));
tasksRouter.get('/task/list', async (req: Request, res: Response) => await (await taskFactory()).httpListTasks(req, res));
tasksRouter.get   ('/task/find/:id'  , async (req: Request, res: Response) => await (await taskFactory()).httpFindTaskById(req, res));
tasksRouter.put   ('/task/update/:id', async (req: Request, res: Response) => await (await taskFactory()).httpUpdateTask(req, res));
tasksRouter.delete('/task/delete/:id', async (req: Request, res: Response) => await (await taskFactory()).httpDeleteTask(req, res));

export default tasksRouter;