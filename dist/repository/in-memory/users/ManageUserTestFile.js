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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageUserTestFile = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const mockedUsers_1 = require("../../../e2e-tests/users/mockedUsers");
class ManageUserTestFile {
    constructor() {
        this.filePath = path_1.default.resolve(__dirname) + '/UserFile.JSON';
        this.newFile();
    }
    getFilePath() {
        return this.filePath;
    }
    async newFile() {
        try {
            if (!fs.existsSync(this.filePath)) {
                await fs.promises.writeFile(this.filePath, JSON.stringify(mockedUsers_1.mockedUsers));
            }
        }
        catch (error) {
            console.error('Error creating file UserFile.JSON:', error);
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
    async deleteFile() {
        try {
            if (fs.existsSync(this.filePath)) {
                await fs.promises.unlink(this.filePath);
            }
        }
        catch (error) {
            console.error('Error deleting file UserFile.JSON:', error);
            throw error;
        }
    }
}
exports.ManageUserTestFile = ManageUserTestFile;
