

import * as fs from 'fs';
import { ManageLoginTestFile } from './ManageLoginTestFile';

// Mock console.log and console.error globally for the entire test suite
// So we keep a clear console when tests should return error 
global.console.log = jest.fn();
global.console.error = jest.fn();

beforeAll( async () => {
  const manageLoginTestFile = new ManageLoginTestFile();
  await manageLoginTestFile.resetFile();
})

beforeEach(() => {
  jest.resetAllMocks()
  jest.clearAllMocks()
})

describe('ManageLoginTestFile', () => {
  describe('newFile', () => {
    it('should throw an error if fs.promises.writeFile() fails', async () => {
      try {
        jest.spyOn(fs.promises, 'writeFile').mockRejectedValue(new Error('Error deleting file'));
        const manageLoginTestFile = new ManageLoginTestFile();
        await manageLoginTestFile.newFile();
      } catch (error: any) {
        expect(error.message).toBe('Error creating file');
      }
    });

    it('should throw an error if fs.promises.unlink fails', async () => {
      try {
        jest.spyOn(fs.promises, 'unlink').mockRejectedValue(new Error('Error deleting file'));
        const manageLoginTestFile = new ManageLoginTestFile();
        await manageLoginTestFile.deleteFile();
      } catch (error: any) {
        expect(error.message).toBe('Error deleting file');
      }
    });
  });
});
function async() {
  throw new Error('Function not implemented.');
}

