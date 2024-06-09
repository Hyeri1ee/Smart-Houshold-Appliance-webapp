import express from "express";
import {getUsersWithSchedules,assignSchedulesToPeakTimes,forAuthorizedUserSchedule} from "../controller/advice-controller";

export const  adviceRoute = express.Router();

adviceRoute.get("/", getUsersWithSchedules,assignSchedulesToPeakTimes,forAuthorizedUserSchedule);