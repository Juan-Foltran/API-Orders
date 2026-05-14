import { Router } from 'express';
import { createUser } from '../controllers/users/usersCreate.controller.js';

export const route = Router();

route.post('/createUser', createUser);
