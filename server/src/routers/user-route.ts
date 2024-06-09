import express from "express";
import {checkUserInfo} from '../controller/user-controller';

export const userRoute = express.Router();

userRoute.get('/info', checkUserInfo);