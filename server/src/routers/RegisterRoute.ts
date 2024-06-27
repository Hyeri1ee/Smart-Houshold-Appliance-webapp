// src/routers/RegisterRoute.ts
import express from 'express';
import { handleRegister } from '../controllers/auth/RegisterController';

export const registerRoute = express.Router();

registerRoute.post('/', handleRegister);