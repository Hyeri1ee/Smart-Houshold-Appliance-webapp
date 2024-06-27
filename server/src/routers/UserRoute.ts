import express from "express";
import {checkUserInfo} from '../controllers/user/UserInfoController';
import { setProfiletype } from "../controllers/user/UserProfileController";
import {checkTimeslot, putTimeslots} from "../controllers/user/TimeslotController";

export const userRoute = express.Router();

userRoute.get('/info', checkUserInfo);
userRoute.post('/profile', setProfiletype);
userRoute.get("/timeslots", checkTimeslot);
userRoute.put("/timeslots", putTimeslots);