import * as fs from 'fs';
import path from 'path';
import { mockedLogin } from '../../../e2e-tests/users/mockedLogin';

class ManageLoginTestFile {
  private readonly filePath: string = path.resolve(__dirname) + '/LoginFile.JSON';

  constructor() {
    this.newFile();
  }

  getFilePath() {
    return this.filePath;
  }

  async newFile() {
    try {
      if (!fs.existsSync(this.filePath)) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(mockedLogin));
      }
    } catch (error) {
      console.error('Error creating file LoginFile.JSON:', error);
      throw error;
    }
  }

  getFile() {
    return this.filePath;
  }

  async resetFile() {
    await this.deleteFile();
    await this.newFile();
  }

  async deleteFile(): Promise<void> {
    try {
      if (fs.existsSync(this.filePath)) {
        await fs.promises.unlink(this.filePath);
      }
    } catch (error) {
      console.error('Error deleting file LoginFile.JSON:', error);
      throw error;
    }
  }
}

export { ManageLoginTestFile };
