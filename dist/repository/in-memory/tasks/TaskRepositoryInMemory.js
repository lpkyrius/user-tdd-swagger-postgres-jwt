"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRepositoryInMemory = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs = __importStar(require("fs"));
const ManageTaskTestFile_1 = require("./ManageTaskTestFile");
class TasksRepositoryInMemory {
    constructor() {
        const manageTaskTestFile = new ManageTaskTestFile_1.ManageTaskTestFile();
        this.filePath = manageTaskTestFile.getFile();
    }
    async add(task) {
        const tasks = this.readTasksFromFile();
        const newTask = { ...task, id: crypto_1.default.randomUUID(), created_at: new Date(new Date().toISOString()) };
        tasks.push(newTask);
        this.writeTasksToFile(tasks);
        return newTask;
    }
    async update(task) {
        const tasks = this.readTasksFromFile();
        const index = tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
            tasks[index] = task;
            this.writeTasksToFile(tasks);
            return task;
        }
        throw new Error('task not found');
    }
    async delete(id) {
        const tasks = this.readTasksFromFile();
        const initialLength = tasks.length;
        const filteredTasks = tasks.filter((t) => t.id !== id);
        if (filteredTasks.length !== initialLength) {
            this.writeTasksToFile(filteredTasks);
            return true;
        }
        return false;
    }
    async exists(id) {
        const tasks = this.readTasksFromFile();
        return tasks.some((task) => task.id === id);
    }
    async list() {
        return this.readTasksFromFile();
    }
    async findTaskById(id) {
        const tasks = this.readTasksFromFile();
        const index = tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
            return tasks[index];
        }
        throw new Error('id not found');
    }
    readTasksFromFile() {
        const fileData = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(fileData);
    }
    writeTasksToFile(tasks) {
        fs.writeFileSync(this.filePath, JSON.stringify(tasks, null, 2));
    }
}
exports.TasksRepositoryInMemory = TasksRepositoryInMemory;
