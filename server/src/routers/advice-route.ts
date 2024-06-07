import express from "express";
import {getUsersWithSchedules,assignSchedulesToPeakTimes} from "../controller/advice-controller";

export const  adviceRoute = express.Router();

adviceRoute.get("/", getUsersWithSchedules,assignSchedulesToPeakTimes);