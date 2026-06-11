import { Router } from 'express';
import { createUser } from '../controllers/users/usersCreate.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { login } from '../controllers/users/login.controller.js';
import { newRequest } from '../controllers/stores/RequestNewStore.controller.js';

export const route = Router();

// routes users
route.post('/createUser', createUser);
route.post('/login', login);

//route sotores
route.post('/RequestStore', authMiddleware, newRequest);
