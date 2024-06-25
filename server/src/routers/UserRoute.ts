import express from "express";
import {checkUserInfo} from '../controllers/UserController';
import { setProfiletype } from "../controllers/UserProfileController";
import {checkTimeslots, putTimeslots} from "../controllers/TimeslotController";

export const userRoute = express.Router();

userRoute.get('/info', checkUserInfo);
userRoute.post('/profile', setProfiletype);
userRoute.get("/timeslots", checkTimeslots);
userRoute.put("/timeslots", putTimeslots);