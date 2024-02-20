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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const ManageUserTestFile_1 = require("./ManageUserTestFile");
// Mock console.log and console.error globally for the entire test suite
// So we keep a clear console when tests should return error 
global.console.log = jest.fn();
global.console.error = jest.fn();
beforeAll(async () => {
    const manageUserTestFile = new ManageUserTestFile_1.ManageUserTestFile();
    await manageUserTestFile.resetFile();
});
beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});
describe('ManageUserTestFile', () => {
    describe('newFile', () => {
        it('should throw an error if fs.promises.writeFile() fails', async () => {
            try {
                jest.spyOn(fs.promises, 'writeFile').mockRejectedValue(new Error('Error deleting file'));
                const manageUserTestFile = new ManageUserTestFile_1.ManageUserTestFile();
                await manageUserTestFile.newFile();
            }
            catch (error) {
                expect(error.message).toBe('Error creating file');
            }
        });
        it('should throw an error if fs.promises.unlink fails', async () => {
            try {
                jest.spyOn(fs.promises, 'unlink').mockRejectedValue(new Error('Error deleting file'));
                const manageUserTestFile = new ManageUserTestFile_1.ManageUserTestFile();
                await manageUserTestFile.deleteFile();
            }
            catch (error) {
                expect(error.message).toBe('Error deleting file');
            }
        });
    });
});
function async() {
    throw new Error('Function not implemented.');
}
