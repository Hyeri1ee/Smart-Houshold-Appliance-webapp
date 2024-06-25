import express from "express";
import {putSchedule, checkSchedule,saveSchedule} from "../controllers/ScheduleController";

export const scheduleRoute = express.Router();

scheduleRoute.get("/", checkSchedule);
scheduleRoute.put("/", putSchedule);
scheduleRoute.post("/", saveSchedule);