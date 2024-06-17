import express from "express";
import {checkUserInfo} from '../controllers/UserController';

export const userRoute = express.Router();

userRoute.get('/info', checkUserInfo);