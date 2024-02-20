import * as fs from 'fs';
import { ManageTaskTestFile } from './ManageTaskTestFile';

// Mock console.log and console.error globally for the entire test suite
// So we keep a clear console when tests should return error 
global.console.log = jest.fn();
global.console.error = jest.fn();

beforeAll( async () => {
  const manageTaskTestFile = new ManageTaskTestFile();
  await manageTaskTestFile.resetFile();
})

beforeEach(() => {
  jest.resetAllMocks()
  jest.clearAllMocks()
})

describe('ManageTaskTestFile', () => {
  describe('newFile', () => {
    it('should throw an error if fs.promises.writeFile() fails', async () => {
      try {
        jest.spyOn(fs.promises, 'writeFile').mockRejectedValue(new Error('Error deleting file'));
        const manageTaskTestFile = new ManageTaskTestFile();
        await manageTaskTestFile.newFile();
      } catch (error: any) {
        expect(error.message).toBe('Error creating file');
      }
    });

    it('should throw an error if fs.promises.unlink fails', async () => {
      try {
        jest.spyOn(fs.promises, 'unlink').mockRejectedValue(new Error('Error deleting file'));
        const manageTaskTestFile = new ManageTaskTestFile();
        await manageTaskTestFile.deleteFile();
      } catch (error: any) {
        expect(error.message).toBe('Error deleting file');
      }
    });
  });
});
