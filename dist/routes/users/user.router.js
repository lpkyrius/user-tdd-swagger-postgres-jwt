"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserFactory_1 = __importDefault(require("../../factory/UserFactory"));
const userRouter = (0, express_1.Router)();
const userFactory = async () => {
    return await UserFactory_1.default.createInstance();
};
userRouter.post('/user/add', async (req, res) => await (await userFactory()).httpAddUser(req, res));
userRouter.post('/user/login', async (req, res) => await (await userFactory()).httpLogin(req, res));
userRouter.get('/user/find/:id', async (req, res) => await (await userFactory()).httpFindUserById(req, res));
userRouter.put('/user/update/:id', async (req, res) => await (await userFactory()).httpUpdateUser(req, res));
exports.default = userRouter;
