import { Task } from "../entities/Task";

export interface ITaskRepository {
  add(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  findTaskById(id: string): Promise<Task>;
  list(): Promise<Task[]>;
}