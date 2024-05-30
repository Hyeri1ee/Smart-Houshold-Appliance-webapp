import express from "express";
import { checkUserExist } from "../controller/loginController";

export const loginRoute = express.Router();

loginRoute.post("/", checkUserExist);