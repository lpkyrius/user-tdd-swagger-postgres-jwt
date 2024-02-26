import { TaskService } from "../services/tasks/TaskService";
import { TaskController } from "../routes/tasks/TaskController";
import { TasksRepositoryInMemory } from "../repository/in-memory/tasks/TaskRepositoryInMemory";
import { TaskRepositoryInPostgres } from "../repository/postgres/tasks/TaskRepositoryInPostgres";
export default class TaskFactory {
  static async createInstance() {
    // const taskRepository = new TasksRepositoryInMemory();
    const taskRepository = new TaskRepositoryInPostgres();
    const taskService = new TaskService(taskRepository);
    const taskController = new TaskController(taskService);
  
    return taskController;
  }
}