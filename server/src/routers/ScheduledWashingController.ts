import express from "express";
import {addScheduledWash} from "../controllers/ScheduleController";

export const washingScheduleRoute = express.Router();

washingScheduleRoute.post("/", addScheduledWash);