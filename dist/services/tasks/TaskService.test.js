"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const TaskService_1 = require("./TaskService");
const TaskRepositoryInMemory_1 = require("../../repository/in-memory/tasks/TaskRepositoryInMemory");
(0, globals_1.describe)('#taskService', () => {
    let tasksRepository;
    let taskService;
    (0, globals_1.beforeAll)(() => {
        tasksRepository = new TaskRepositoryInMemory_1.TasksRepositoryInMemory();
        taskService = new TaskService_1.TaskService(tasksRepository);
    });
    (0, globals_1.describe)('#Task exists', () => {
        let task;
        it('should return false when check if a non-existent task exists', async () => {
            const checkTask = {
                id: 'this.id.does.not.exist',
                summary: 'Test summary not existent task.',
            };
            const result = await taskService.exist(checkTask.id);
            (0, globals_1.expect)(result).toBe(false);
        });
    });
    (0, globals_1.describe)('#Create Tasks', () => {
        let addedTask;
        it('should be able to create a new task and confirm it exists', async () => {
            const taskData = {
                userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
                summary: 'Test summary created with unit test.',
            };
            addedTask = await taskService.add(taskData);
            const result = await taskService.exist(addedTask.id);
            (0, globals_1.expect)(result).toBe(true);
            (0, globals_1.expect)(addedTask).toHaveProperty('id');
            (0, globals_1.expect)(addedTask).toHaveProperty('created_at');
            (0, globals_1.expect)(addedTask.summary).toBe('Test summary created with unit test.');
        });
    });
    (0, globals_1.describe)('#List Tasks', () => {
        let tasks;
        const taskStructure = globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                id: globals_1.expect.any(String),
                userId: globals_1.expect.any(String),
                summary: globals_1.expect.any(String),
                created_at: globals_1.expect.any(String),
            }),
        ]);
        it('should receive an array of tasks', async () => {
            tasks = await taskService.list();
            (0, globals_1.expect)(tasks).toBeInstanceOf(Array);
            (0, globals_1.expect)(tasks).toEqual(taskStructure);
        });
    });
    (0, globals_1.describe)('#Find Tasks', () => {
        let task;
        it('should find an existent task', async () => {
            const taskData = {
                userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
                summary: 'Test summary to be found',
            };
            task = await taskService.add(taskData);
            const taskFound = await taskService.findById(task.id);
            (0, globals_1.expect)(taskFound.summary).toEqual('Test summary to be found');
        });
        it('should throw an error when trying to find a non-existing task on TaskService', async () => {
            await (0, globals_1.expect)(async () => {
                const findTaskError = await taskService.findById('this.id.should.not.exist');
            }).rejects.toThrow('id not found');
        });
    });
    (0, globals_1.describe)('#Update Tasks', () => {
        let task, result;
        it('should be able to update an existent task', async () => {
            const taskData = {
                userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
                summary: 'Test summary to be updated',
            };
            task = await taskService.add(taskData);
            let updatedTask = Object.assign({}, task);
            updatedTask.summary = 'Test summary already updated!!!';
            result = await taskService.update(updatedTask);
            (0, globals_1.expect)(result.summary).toBe('Test summary already updated!!!');
        });
        it('should throw an error when updating a non-existing task on TaskService', async () => {
            const taskError = {
                id: 'this.id.should.not.exist',
                summary: 'Test summary to be throw error',
            };
            await (0, globals_1.expect)(async () => {
                const updatedTaskError = await taskService.update(taskError);
            }).rejects.toThrow('task not found');
        });
    });
    (0, globals_1.describe)('#Delete Tasks', () => {
        it('should be able to delete an existent task', async () => {
            const taskData = {
                userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
                summary: 'Test summary to be deleted',
            };
            const task = await taskService.add(taskData);
            const existNewTask = await taskService.exist(task.id);
            const taskDeleted = await taskService.delete(task.id);
            const existAfterDelete = await taskService.exist(task.id);
            (0, globals_1.expect)(taskDeleted).toBeTruthy;
            (0, globals_1.expect)(existNewTask).toBe(true);
            (0, globals_1.expect)(existAfterDelete).toBe(false);
        });
        it('should return false when deleting a non-existing task on TaskService', async () => {
            const testDel = async function () {
                return await taskService.delete('this.id.should.not.exist');
            };
            (0, globals_1.expect)(await testDel()).toBeFalsy();
        });
    });
});
