import { Router } from 'express';
import { createUser } from '../controllers/users/users-create.js';

export const route = Router();

route.post('/createUser', createUser);
