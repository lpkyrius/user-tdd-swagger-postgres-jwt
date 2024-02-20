"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    async httpAddTask(req, res) {
        try {
            const { userId, summary } = req.body;
            if (!this.checkUserId(userId))
                return res.status(400).json({ error: 'invalid userId' });
            if (!this.checkSummary(summary))
                return res.status(400).json({ error: 'invalid summary' });
            const task = await this.taskService.add({ userId, summary });
            return res.status(201).json(task);
        }
        catch (error) {
            console.error(`httpAddTask Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to add a task' });
        }
    }
    async httpListTasks(req, res) {
        try {
            const taskList = await this.taskService.list();
            return res.status(200).json(taskList);
        }
        catch (error) {
            console.error(`httpListTasks Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to list tasks' });
        }
    }
    async httpFindTaskById(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({ error: 'invalid id' });
            const taskFound = await this.taskService.findById(id);
            if (taskFound)
                return res.status(200).json(taskFound);
            return res.status(200).json(await this.taskService.findById(id));
        }
        catch (error) {
            if (error.message.includes('id not found'))
                return res.status(404).json({ error: 'task not found' });
            console.error(`httpFindTaskById Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to find the task' });
        }
    }
    async httpUpdateTask(req, res) {
        try {
            const taskToUpdate = req.body;
            const id = req.params.id;
            taskToUpdate.id = id;
            if (!this.checkUserId(taskToUpdate.userId))
                return res.status(400).json({ error: 'invalid userId' });
            if (!this.checkSummary(taskToUpdate.summary))
                return res.status(400).json({ error: 'invalid summary' });
            const task = await this.taskService.update(taskToUpdate);
            return res.status(200).json(task);
        }
        catch (error) {
            if (error.message.includes('task not found'))
                return res.status(404).json({ error: 'task not found' });
            console.error(`httpUpdateTask Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to update a task' });
        }
    }
    async httpDeleteTask(req, res) {
        try {
            const id = req.params.id;
            const deletedTask = await this.taskService.delete(id);
            if (!deletedTask)
                return res.status(404).json({ message: 'task not found' });
            return res.status(200).json({ message: 'success' });
        }
        catch (error) {
            console.error(`httpDeleteTask Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to delete a task' });
        }
    }
    checkUserId(userId) {
        try {
            // Size between 3 to 100
            const PWD_REGEX = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
            if (!userId)
                return false;
            if (PWD_REGEX.test(userId))
                return true;
            return false;
        }
        catch (error) {
            console.error(`checkUserId Error-> ${error}`);
        }
    }
    checkSummary(summary) {
        try {
            // Matches any alphanumeric character or the specified symbols. 
            // Size between 3 to 100
            const PWD_REGEX = /^.{3,100}$/;
            if (!summary)
                return false;
            if (PWD_REGEX.test(summary))
                return true;
            return false;
        }
        catch (error) {
            console.error(`checkUserId Error-> ${error}`);
        }
    }
}
exports.TaskController = TaskController;
