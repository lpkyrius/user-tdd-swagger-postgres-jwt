"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const TaskRepositoryInMemory_1 = require("./TaskRepositoryInMemory");
(0, globals_1.describe)('#taskService', () => {
    let tasksRepository;
    (0, globals_1.beforeAll)(() => {
        tasksRepository = new TaskRepositoryInMemory_1.TasksRepositoryInMemory();
    });
    (0, globals_1.describe)('#Find Task by Id', () => {
        it('should throw an error if the task ID is not found', async () => {
            try {
                await tasksRepository.findTaskById('this.id.should.not.exist');
            }
            catch (error) {
                (0, globals_1.expect)(error.message).toBe('id not found');
            }
        });
    });
    (0, globals_1.describe)('#Delete Tasks', () => {
        it('should return false when deleting a non-existing task on RepositoryInMemory', async () => {
            const testDel = async function () {
                return await tasksRepository.delete('this.id.should.not.exist');
            };
            (0, globals_1.expect)(await testDel()).toBeFalsy();
        });
    });
});
