import express from "express";
import {putSchedule, checkSchedule} from "../controllers/ScheduleController";

export const scheduleRoute = express.Router();

scheduleRoute.get("/", checkSchedule);
scheduleRoute.put("/", putSchedule);