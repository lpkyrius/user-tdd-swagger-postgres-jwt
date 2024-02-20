"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskFactory_1 = __importDefault(require("../../factory/TaskFactory"));
const tasksRouter = (0, express_1.Router)();
const taskFactory = async () => {
    return await TaskFactory_1.default.createInstance();
};
tasksRouter.post('/task/add', async (req, res) => await (await taskFactory()).httpAddTask(req, res));
tasksRouter.get('/task/list', async (req, res) => await (await taskFactory()).httpListTasks(req, res));
tasksRouter.get('/task/find/:id', async (req, res) => await (await taskFactory()).httpFindTaskById(req, res));
tasksRouter.put('/task/update/:id', async (req, res) => await (await taskFactory()).httpUpdateTask(req, res));
tasksRouter.delete('/task/delete/:id', async (req, res) => await (await taskFactory()).httpDeleteTask(req, res));
exports.default = tasksRouter;
