// src/routers/register-route.ts
import express from 'express';
import { handleRegister } from '../controller/register-controller';

export const registerRoute = express.Router();

registerRoute.post('/', handleRegister);