import express, { Request, Response, NextFunction }  from 'express';
require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        ( err: any, decoded: any) => {
            if (err) return res.sendStatus(403).send('invalid token');  
            next();
        }
    )
}

export default verifyJWT;