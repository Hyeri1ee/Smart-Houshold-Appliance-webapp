import express from "express";
import {checkUserInfo} from '../controllers/user/UserInfoController';
import { setProfiletype } from "../controllers/user/UserProfileController";
import {timeslotRoute} from "./TimeslotRoute";

export const userRoute = express.Router();

userRoute.get('/info', checkUserInfo);
userRoute.post('/profile', setProfiletype);
userRoute.use("/timeslots", timeslotRoute);