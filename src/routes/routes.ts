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
import { update } from '../controllers/stores/updateProducts.controller.js';
import { listingStores } from '../controllers/users/listStores.controller.js';

export const route = Router();

// routes users
route.post('/user/create', createUser);
route.post('/login', login);
route.get('/stores', authMiddleware, listingStores);

//route stores
route.post('/requestStore', authMiddleware, newRequest);
route.get('/requestStore/me', authMiddleware, listMyRequests);
route.post('/product/create/:storeId', authOwner, creation);
route.delete('/product/delete/:storeId', authOwner, del);
route.get('/product/list/:storeId', authOwner, listingProducts);
route.patch('/product/update/:storeId', authOwner, update);

// Admin routes
route.get('/requests', authAdm, listing);
route.post('/requests/update', authAdm, updateRequest);
