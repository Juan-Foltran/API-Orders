import { Router } from 'express';
import { createUser } from '../controllers/users/usersCreate.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { login } from '../controllers/users/login.controller.js';
import { newRequest } from '../controllers/stores/RequestNewStore.controller.js';
import { listing } from '../controllers/stores/listRequest.controller.js';
import { authAdm } from '../middlewares/authAdm.middleware.js';
import { authOwner } from '../middlewares/authOwner.middleware.js';
import { creation } from '../controllers/stores/createProducts.controller.js';

export const route = Router();

// routes users
route.post('/createUser', createUser);
route.post('/login', login);

//route stores
route.post('/requestStore', authMiddleware, newRequest);

// Admin routes
route.get('/requests', authAdm, listing);
route.post('/post-new-product', authOwner, creation);
