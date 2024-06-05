import express from "express";
import {adviceBestTime} from "../controller/advice-controller";

export const  adviceRoute = express.Router();

adviceRoute.get("/", adviceBestTime);