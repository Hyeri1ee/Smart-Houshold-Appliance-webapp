import express from "express";
import { putSchedule, checkSchedule, deleteSchedule, deleteDaySchedule } from "../controllers/ScheduleController";

export const scheduleRoute = express.Router();

scheduleRoute.get("/getTimeslots", checkSchedule);
scheduleRoute.put("/putTimeslots", putSchedule);
scheduleRoute.delete("/deleteTimeslots", deleteSchedule);
scheduleRoute.delete("/deleteDay/:dayId", deleteDaySchedule);
