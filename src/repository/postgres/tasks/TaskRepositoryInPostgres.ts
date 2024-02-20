import crypto from 'crypto';
import { Task } from "../../../entities/Task";
import { ITaskRepository } from "../../ITaskRepository";
import { db } from '../../../services/postgres/postgres';

class TaskRepositoryInPostgres implements ITaskRepository {

  async add(task: Task): Promise<Task> {
    try {
      const newTask: Task = { ...task, id: crypto.randomUUID(), created_at: new Date(new Date().toISOString()) };
      const savedTask = await db('maintenance_task')
          .insert({
            id: newTask.id,
            user_id: newTask.userId,
            summary: newTask.summary,
            created_at: newTask.created_at 
          })
          .returning('*');
          
      return savedTask[0];  
            
    } catch (error) {
        console.log(`Error in addTask(): ${error}`);
        throw error;
    }
  }

  async update(task: Task): Promise<Task> {
    try {
      const { summary } = task
      const updatedUser = await db('maintenance_task')
        .where('id', '=', task.id)
        .update({
            summary
          })
        .returning('*');
      
      if (!updatedUser.length)
        throw new Error('task not found');

      return updatedUser[0];
  } catch (error) {
      console.log(`Error in updateUser(): ${ error }`);
      throw error;
  }
  }

  async delete(id: string): Promise<boolean> {
    try {

      const deletedTokenData = await db('maintenance_task')
          .where({ id })
          .del()
          .returning("id");

      if (!deletedTokenData.length)
        return false;
      
      return true;
    } catch (error) {
        console.log(`Error in getCurrentUserRefreshToken(): ${ error }`);
        throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const recoveredData = await db('maintenance_task')
          .select('*')
          .from('maintenance_task')
          .where({ id })

      if (!recoveredData.length)
        return false;

      return true;
    } catch (error) {
        console.log(`Error in exists(): ${ error }`)
        throw error;
    }
  }

  async list(): Promise<Task[]> {
    try {
      const recoveredData = await db('maintenance_task')
      .select('id', 'user_id as userId', 'summary', 'created_at').from('maintenance_task');
    
    return recoveredData;
  } catch (error) {
      console.log(`Error in list(): ${ error }`)
      throw error;
  }
  }

  async findTaskById(id: string): Promise<Task> {
    try {
      const recoveredData = await db('maintenance_task')
          .select('*')
          .from('maintenance_task')
          .where({ id })

          if (!recoveredData.length)
            throw new Error('id not found');
      
        return recoveredData[0];
    } catch (error) {
        console.log(`Error in findTaskById(): ${ error }`)
        throw error;
    }
  }

}

export { TaskRepositoryInPostgres };
