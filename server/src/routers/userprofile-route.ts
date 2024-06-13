import express from "express";
import {setProfiletype} from "../controller/userprofile-controller";

export const  userProfileRoute = express.Router();

userProfileRoute.post("/", setProfiletype);
