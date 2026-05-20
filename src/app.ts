import express from 'express';
import { route } from './routes/users.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(route);

export default app;
