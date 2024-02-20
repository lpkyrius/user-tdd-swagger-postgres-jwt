import { Router, Request, Response } from 'express';
import UserFactory from '../../factory/UserFactory';

const userRouter = Router();

const userFactory = async () => {
    return await UserFactory.createInstance();
}

userRouter.post('/user/add'  , async (req: Request, res: Response) => await (await userFactory()).httpAddUser(req, res));
userRouter.post('/user/login', async (req: Request, res: Response) => await (await userFactory()).httpLogin(req, res));
userRouter.get ('/user/find/:id'  , async (req: Request, res: Response) => await (await userFactory()).httpFindUserById(req, res));
userRouter.put ('/user/update/:id', async (req: Request, res: Response) => await (await userFactory()).httpUpdateUser(req, res));

export default userRouter;