import express from "express";
import {checkUserExist} from "../controller/login-controller";
// import {authenticateToken} from "../controller/auth-middleware";

export const  loginRoute = express.Router();

loginRoute.post("/", checkUserExist);
// loginRoute.post("/", authenticateToken, checkUserExist);