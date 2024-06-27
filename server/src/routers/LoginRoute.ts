import express from "express";
import {checkUserExist} from "../controllers/auth/LoginController";

export const  loginRoute = express.Router();

loginRoute.post("/", checkUserExist);