import crypto from 'crypto';
import * as fs from 'fs';
import { Task } from "../../../entities/Task";
import { ITaskRepository } from "../../ITaskRepository";
import { ManageTaskTestFile } from "./ManageTaskTestFile";
class TasksRepositoryInMemory implements ITaskRepository {

  private readonly filePath: string;

  constructor() {
    const manageTaskTestFile = new ManageTaskTestFile();
    this.filePath = manageTaskTestFile.getFile();
  }

  async add(task: Task): Promise<Task> {
    const tasks = this.readTasksFromFile();
    // const newTask = { ...task, id: crypto.randomUUID(), created_at: new Date(new Date().toISOString()) };
    const newTask = { 
      id: crypto.randomUUID(), 
      user_id: task.userId,
      summary: task.summary,
      created_at: new Date(new Date().toISOString())
    };
    tasks.push(newTask);
    this.writeTasksToFile(tasks);
    return newTask;
  }

  async update(task: Task): Promise<Task> {
    const tasks = this.readTasksFromFile();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      this.writeTasksToFile(tasks);
      return task;
    }
    throw new Error('task not found');
  }

  async delete(id: string): Promise<boolean> {
    const tasks = this.readTasksFromFile();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter((t) => t.id !== id);
    if (filteredTasks.length !== initialLength) {
      this.writeTasksToFile(filteredTasks);
      return true;
    }
    return false;
  }

  async exists(id: string): Promise<boolean> {
    const tasks = this.readTasksFromFile();
    
    return tasks.some((task) => task.id === id);
  }

  async list(): Promise<Task[]> {
    return this.readTasksFromFile();
  }

  async findTaskById(id: string): Promise<Task> {
    const tasks = this.readTasksFromFile();
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      return tasks[index];
    }
    throw new Error('id not found');
  }

  private readTasksFromFile(): Task[] {
    const fileData = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(fileData);
  }

  private writeTasksToFile(tasks: Task[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(tasks, null, 2));
  }
}

export { TasksRepositoryInMemory };
