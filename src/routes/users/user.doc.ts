// Reference: https://editor.swagger.io/ 

const user = {
    email: 'matt.tech@email.com',
    password: 'matt.tech@123',
    role: '2',
};

const return200 = {
    description: 'Success',
    content: {
        'application/json': {
            schema:{
                type: 'object',
                example: { message: 'success'}
            }
        }
    }
};

const return201 = {
    description: 'Success',
    content: {
        'application/json': {
            schema:{
                type: 'object',
                example: user
            }
        }
    }
};

const return400 = {
    description: 'Invalid',
    content: {
        'application/json': {
            schema:{
                type: 'object',
                example: {error: 'invalid data' }
            }
        }
    }
};

const return404 = {
    description: 'Not found',
    content: {
        'application/json': {
            schema:{
                type: 'object',
                example: {error: 'task not found' }
            }
        }
    }
};

const return500 = {
    description: 'Internal error',
    content: {
        'application/json': {
            schema:{
                type: 'object',
                example: { error: 'internal error during process' }
            }
        }
    }
};

// userRouter.post('/user/add', ...
const userAddSchema = {
    post: {
        tags: ['User'],
        summary: 'Create new users',
        description: 'Create a new user (register)',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                description: 'User email address',
                                example: 'matt.tech@email.com'
                            },
                            password: {
                                type: 'string',
                                description: 'Password to log in',
                                example: 'matt.tech@123'
                            },
                            role: {
                                type: 'string',
                                description: 'User role which could be 1 (for Managers) or 2 (for technicians)',
                                example: '2'
                            },
                        }
                    }
                }
            }
        },
        responses:{
            201: return201,
            500: return500,
        } 
    }
};

// userRouter.post('/user/login, ...
const userLogin = {
    post: {
        tags: ['User'],
        summary: 'User login',
        description: 'Log in with a valid user email and password',
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                description: 'User email address',
                                example: 'matt.tech@email.com'
                            },
                            password: {
                                type: 'string',
                                description: 'Password to log in',
                                example: 'matt.tech@123'
                            }
                        }
                    }
                }
            }
        },
        responses:{
            200: return200,
            400: return400,
            500: return500,
        } 
    }
};

// userRouter.get ('/user/find/:id', ...
const usersByIdSchema = {
    get: {
        tags: ['User'],
        summary: 'Get user from query id',
        description: 'Get user by its id',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'id of the user',
                type: 'string',
                example: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
            },
        ],
        responses:{
            200: return200,
            404: return404,
            500: return500,
        } 
    }
};

// userRouter.put ('/user/update/:id', ...
const userUpdateSchema = {
    put: {
        tags: ['User'],
        summary: 'Update user data',
        description: 'Update the user email and/or role',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'id of the task',
                type: 'string',
                example: '943b7681-b1c3-4244-8a37-423ae7a3d7bc',
            },
        ],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                description: 'User email address',
                                example: 'mary.updated.tech@email.com'
                            },
                            role: {
                                type: 'string',
                                description: 'User role which could be 1 (for Managers) or 2 (for technicians)',
                                example: '1'
                            },
                        }
                    }
                }
            }
        },
        responses:{
            200: return200,
            404: return404,
            500: return500,
        } 
    }
};

export const userRouteDoc = {
    '/user/add': userAddSchema,
    '/user/login': userLogin,
    '/user/find/{id}': usersByIdSchema,
    '/user/update/{id}': userUpdateSchema,
};