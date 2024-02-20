"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TaskService_1 = require("../services/tasks/TaskService");
const TaskController_1 = require("../routes/tasks/TaskController");
const TaskRepositoryInMemory_1 = require("../repository/in-memory/tasks/TaskRepositoryInMemory");
class TaskFactory {
    static async createInstance() {
        const taskRepository = new TaskRepositoryInMemory_1.TasksRepositoryInMemory();
        const taskService = new TaskService_1.TaskService(taskRepository);
        const taskController = new TaskController_1.TaskController(taskService);
        return taskController;
    }
}
exports.default = TaskFactory;
