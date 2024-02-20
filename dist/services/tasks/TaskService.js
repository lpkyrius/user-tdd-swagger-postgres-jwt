"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
;
class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async add({ userId, summary }) {
        return await this.taskRepository.add({ userId, summary });
    }
    async update(taskToUpdate) {
        return await this.taskRepository.update(taskToUpdate);
    }
    async delete(id) {
        return await this.taskRepository.delete(id);
    }
    async list() {
        return await this.taskRepository.list();
    }
    async findById(id) {
        return await this.taskRepository.findTaskById(id);
    }
    async exist(id) {
        return await this.taskRepository.exists(id);
    }
}
exports.TaskService = TaskService;
