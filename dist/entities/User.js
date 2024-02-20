"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor({ email, password, role }) {
        return Object.assign(this, {
            email,
            password,
            role
        });
    }
}
exports.User = User;
