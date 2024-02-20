import { expect, describe, beforeAll } from '@jest/globals';
import { Task } from '../../entities/Task';
import { ITaskRepository } from '../../repository/ITaskRepository';
import { TaskService } from './TaskService';
import { TasksRepositoryInMemory } from '../../repository/in-memory/tasks/TaskRepositoryInMemory';
import { TaskRepositoryInPostgres } from '../../repository/postgres/tasks/TaskRepositoryInPostgres';

// Mock console.log and console.error globally for the entire test suite
// So we keep a clear console when tests should return error 
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('#taskService', () => {

  // to enable/disable one specific test (in memory or postgres) 
  // just comment the correspondent line withing the repositories object below
  const repositories: Record<string, string> = { 
    inmemory: 'InMemory', 
    database: 'Postgres' 
  };

  for (const property in repositories) {
    
    let tasksRepository: ITaskRepository;
    let taskService: TaskService;

    // run tests twice, on for InMemory and one for Postgres
    beforeAll(() => {
      if (repositories[property] == 'InMemory'){
        tasksRepository = new TasksRepositoryInMemory();
      } else {
        tasksRepository = new TaskRepositoryInPostgres();
      }
      taskService = new TaskService(tasksRepository);
    });

    describe('#Task exists', () => {
      let task: Task; 

      it('should return false when check if a non-existent task exists', async () => {
        const checkTask = {
          id: 'this.id.does.not.exist',
          summary: 'Test summary not existent task.',
        };
        const result: boolean = await taskService.exist(checkTask.id!);

        expect(result).toBe(false);
      });
    });

    describe('#Create Tasks', () => {
      let addedTask: Task; 

      it('should be able to create a new task and confirm it exists', async () => {
        const taskData = {
          userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
          summary: 'Test summary created with unit test.',
        };

        addedTask = await taskService.add(taskData);
        const result: boolean = await taskService.exist(addedTask.id!);

        expect(result).toBe(true);
        expect(addedTask).toHaveProperty('id');
        expect(addedTask).toHaveProperty('created_at');
        expect(addedTask.summary).toBe('Test summary created with unit test.');
      });

    });
    
    describe('#List Tasks', () => {
      let tasks: Task[];

      let taskRawStructure = {
        id: expect.any(String),
        userId: expect.any(String),
        summary: expect.any(String),
        created_at: expect.any(Date)
      };
      
      if (repositories[property] == 'InMemory')
        taskRawStructure.created_at = expect.any(String)

      const taskStructure = expect.arrayContaining([
        expect.objectContaining(taskRawStructure),
      ]);

      it('should receive an array of tasks', async () => {
        tasks = await taskService.list();
        
        expect(tasks).toBeInstanceOf(Array);
        expect(tasks).toEqual(taskStructure);
      });
    });

    describe('#Find Tasks', () => {
      let task: Task;

      it('should find an existent task', async () => {
        const taskData = {
          userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
          summary: 'Test summary to be found',
        };

        task = await taskService.add(taskData);
        const taskFound: Task = await taskService.findById(task.id!);

        expect(taskFound.summary).toEqual('Test summary to be found')
      });

      it('should throw an error when trying to find a non-existing task on TaskService', async () => {
        await expect(async () => {
          const findTaskError: Task = await taskService.findById('this.id.should.not.exist');
        }).rejects.toThrow('id not found');
      });
    });

    describe('#Update Tasks', () => {
      let task: Task, result: Task; 

      it('should be able to update an existent task', async () => {
        const taskData = {
          userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
          summary: 'Test summary to be updated',
        };

        task = await taskService.add(taskData);

        let updatedTask: Task = Object.assign({}, task);
        updatedTask.summary = 'Test summary already updated!!!';

        result = await taskService.update(updatedTask);

        expect(result.summary).toBe('Test summary already updated!!!');
      });
      
      it('should throw an error when updating a non-existing task on TaskService', async () => {
        const taskError: Task = {
          id: 'this.id.should.not.exist',
          summary: 'Test summary to be throw error',
        };
        await expect(async () => {
          const updatedTaskError: Task = await taskService.update(taskError);
        }).rejects.toThrow('task not found');
      });

    });

    describe('#Delete Tasks', () => {

      it('should be able to delete an existent task', async () => {
        const taskData = {
          userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
          summary: 'Test summary to be deleted',
        };

        const task: Task = await taskService.add(taskData);
        const existNewTask: boolean = await taskService.exist(task.id!);

        const taskDeleted = await taskService.delete(task.id!);
        const existAfterDelete: boolean = await taskService.exist(task.id!);

        expect(taskDeleted).toBeTruthy;
        expect(existNewTask).toBe(true);
        expect(existAfterDelete).toBe(false);
      });

      it('should return false when deleting a non-existing task on TaskService', async () => {
        const testDel = async function () {
          return await taskService.delete('this.id.should.not.exist');
        }
        expect(await testDel()).toBeFalsy();
      });
    });
  }

});