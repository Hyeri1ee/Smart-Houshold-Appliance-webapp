import express from "express";
import {getUsersWithSchedules,assignSchedulesToPeakTimes,forAuthorizedUserSchedule} from "../controllers/AdviceController";

export const  adviceRoute = express.Router();

adviceRoute.get("/", getUsersWithSchedules,assignSchedulesToPeakTimes,forAuthorizedUserSchedule);