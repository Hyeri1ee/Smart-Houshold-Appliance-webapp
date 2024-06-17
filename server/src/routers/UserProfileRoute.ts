import express from "express";
import {setProfiletype} from "../controllers/UserProfileController";

export const  userProfileRoute = express.Router();

userProfileRoute.post("/", setProfiletype);
