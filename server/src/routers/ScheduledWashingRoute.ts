import express from "express";
import { addScheduledWash, deleteScheduledWash, getScheduledWash } from "../controllers/ScheduleController";

export const washingScheduleRoute = express.Router();

washingScheduleRoute.post("/", addScheduledWash);
washingScheduleRoute.get("/", getScheduledWash);
washingScheduleRoute.delete("/", deleteScheduledWash)