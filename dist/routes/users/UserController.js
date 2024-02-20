"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserRole_1 = require("../../repository/in-memory/UserRole");
const passwordMinSize = Number(process.env.PASSWORD_MIN_SIZE || 8);
const passwordMaxSize = Number(process.env.PASSWORD_MAX_SIZE || 100);
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async httpAddUser(req, res) {
        try {
            const { email, password, role } = req.body;
            if (!this.checkEmail(email))
                return res.status(400).json({ error: 'invalid email' });
            if (!this.checkPassword(password))
                return res.status(400).json({ error: `password should contain between ${passwordMinSize} and ${passwordMaxSize} characters` });
            if (!this.checkRole(role))
                return res.status(400).json({ error: 'invalid role' });
            if (await this.userService.emailExists(email))
                return res.status(400).json({ error: 'email already exists' });
            const user = await this.userService.add({ email, password, role });
            return res.status(201).json(user);
        }
        catch (error) {
            console.error(`httpAddUser Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to add an user' });
        }
    }
    async httpLogin(req, res) {
        try {
            const { email, password } = req.body;
            if (!this.checkEmail(email))
                return res.status(400).json({ error: 'invalid email' });
            if (!this.checkPassword(password))
                return res.status(400).json({ error: `password should contain between ${passwordMinSize} and ${passwordMaxSize} characters` });
            if (await this.userService.login({ email, password }))
                return res.status(200).json({ message: 'success' });
        }
        catch (error) {
            console.error(`httpAddUser Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to add an user' });
        }
    }
    async httpFindUserById(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({ error: 'invalid id' });
            const taskFound = await this.userService.findById(id);
            if (taskFound)
                return res.status(200).json(taskFound);
            return res.status(200).json(await this.userService.findById(id));
        }
        catch (error) {
            if (error.message.includes('id not found'))
                return res.status(404).json({ error: 'user not found' });
            console.error(`httpFindTaskById Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to find the user' });
        }
    }
    async httpUpdateUser(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({ error: 'invalid id' });
            const userToUpdate = await this.userService.findById(id);
            if (!userToUpdate)
                return res.status(404).json({ error: 'user not found' });
            userToUpdate.email = req.body.email;
            userToUpdate.role = req.body.role;
            if (!this.checkEmail(userToUpdate.email))
                return res.status(400).json({ error: 'invalid email' });
            if (!this.checkRole(userToUpdate.role))
                return res.status(400).json({ error: 'invalid role' });
            const updatedUser = await this.userService.update(userToUpdate);
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            if (error.message.includes('id not found'))
                return res.status(404).json({ error: 'user not found' });
            console.error(`httpUpdateTask Error-> ${error}`);
            res.status(500).json({ error: 'error attempting to update an user' });
        }
    }
    checkEmail(email) {
        try {
            if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
                return false;
            if (email.length < 3 || email.length > 100)
                return false;
            return true;
        }
        catch (error) {
            console.error(`checkEmail Error-> ${error}`);
        }
    }
    checkPassword(password) {
        if (!password)
            return false;
        if (password.length < passwordMinSize || password.length > passwordMaxSize)
            return false;
        return true;
    }
    checkRole(role) {
        try {
            // Matches any alphanumeric character or the specified symbols. 
            // Size between 3 to 100
            if (!role)
                return false;
            if (!Object.values(UserRole_1.UserRole).includes(role))
                return false;
            return true;
        }
        catch (error) {
            console.error(`checkRole Error-> ${error}`);
        }
    }
}
exports.UserController = UserController;
