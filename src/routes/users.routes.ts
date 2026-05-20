import { Router } from 'express';
import { createUser } from '../controllers/users/usersCreate.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { login } from '../controllers/users/login.controller.js';
import { type Request, type Response } from 'express';

export const route = Router();

route.post('/createUser', createUser);
route.post('/login', login);
