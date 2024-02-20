import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';   
import swaggerUi from 'swagger-ui-express'; 
import { version } from '../../../package.json'; 
import { taskRouteDoc } from '../../routes/tasks/task.doc';
import { userRouteDoc } from '../../routes/users/user.doc';

require('dotenv').config();

const options: swaggerJsdoc.Options = {
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
            version
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
        paths: { ...taskRouteDoc, ...userRouteDoc }
    },
    apis: ['../../routes/tasks/tasks.router.ts', '../../routes/users/user.router.ts']
}

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number){
    // Swagger page
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

export default swaggerDocs;