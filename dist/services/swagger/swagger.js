"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const package_json_1 = require("../../../package.json");
const task_doc_1 = require("../../routes/tasks/task.doc");
const user_doc_1 = require("../../routes/users/user.doc");
require('dotenv').config();
const options = {
    definition: {
        openapi: '3.1.0',
        servers: [
            {
                url: `${process.env.SERVER_ADDRESS || 'http://localhost'}:${process.env.PORT || 8000}`,
            }
        ],
        security: [
            {
                bearerAuth: [],
            },
        ],
        info: {
            title: 'REST API Docs',
            version: package_json_1.version
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        tags: [
            {
                name: "Task",
                description: "Task routes"
            },
            {
                name: "User",
                description: "User routes"
            }
        ],
        paths: { ...task_doc_1.taskRouteDoc, ...user_doc_1.userRouteDoc }
    },
    apis: ['../../routes/tasks/tasks.router.ts', '../../routes/users/user.router.ts']
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    // Swagger page
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Docs in JSON format
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
exports.default = swaggerDocs;
