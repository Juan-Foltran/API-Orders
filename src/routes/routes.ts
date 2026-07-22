import { Router } from 'express';
import { createUser } from '../controllers/users/usersCreate.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { login } from '../controllers/users/login.controller.js';
import { newRequest } from '../controllers/stores/RequestNewStore.controller.js';
import { listingProducts } from '../controllers/stores/listProducts.controller.js';
import { authAdm } from '../middlewares/authAdm.middleware.js';
import { authOwner } from '../middlewares/authOwner.middleware.js';
import { creation } from '../controllers/stores/createProducts.controller.js';
import { listMyRequests } from '../controllers/stores/statusRequest.controller.js';
import { updateRequest } from '../controllers/adm/updateRequest.controller.js';
import { del } from '../controllers/stores/deletePorducts.controller.js';
import { listing } from '../controllers/adm/listRequest.controller.js';

export const route = Router();

// routes users
route.post('/createUser', createUser);
route.post('/login', login);

//route stores
route.post('/requestStore', authMiddleware, newRequest);
route.get('/requestStore/me', authMiddleware, listMyRequests);
route.post('/product/create', authOwner, creation);
route.delete('/product/delete', authOwner, del);
route.get('/product/list/:storeId', authOwner, listingProducts);

// Admin routes
route.get('/requests', authAdm, listing);
route.post('/updateRequest', authAdm, updateRequest);
