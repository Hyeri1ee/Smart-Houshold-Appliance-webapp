import express from "express";
import {setProfiletype} from "../controllers/user/UserProfileController";

export const  userProfileRoute = express.Router();

userProfileRoute.post("/", setProfiletype);
