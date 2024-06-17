import express from "express";
import {checkUserExist} from "../controllers/LoginController";

export const  loginRoute = express.Router();

loginRoute.post("/", checkUserExist);
