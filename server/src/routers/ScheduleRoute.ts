import express from "express";
import { putSchedule, checkSchedule, deleteSchedule, deleteDaySchedule } from "../controllers/ScheduleController";

export const scheduleRoute = express.Router();

scheduleRoute.get("/getSchedule", checkSchedule);
scheduleRoute.put("/putSchedule", putSchedule);
scheduleRoute.delete("/deleteSchedule", deleteSchedule);
scheduleRoute.delete("/deleteDay/:dayId", deleteDaySchedule);
