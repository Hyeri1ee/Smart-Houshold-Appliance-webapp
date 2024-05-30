import express from "express";
import { checkUserExist } from "../controller/login-controller";

export const loginRoute = express.Router();

loginRoute.post("/", checkUserExist);