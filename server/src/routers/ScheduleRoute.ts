import express from "express";
import {putSchedule, checkSchedule, checkprofileTypeandDefaultSchedule} from "../controllers/ScheduleController";
import { scheduler } from "node:timers/promises";

export const scheduleRoute = express.Router();

scheduleRoute.get("/", checkprofileTypeandDefaultSchedule);
// scheduleRoute.get("/", checkSchedule);
scheduleRoute.put("/", putSchedule);