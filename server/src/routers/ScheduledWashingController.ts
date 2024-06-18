import express from "express";
import {addScheduledWash} from "../controllers/ScheduledWashingController";

export const washingScheduleRoute = express.Router();

washingScheduleRoute.post("/", addScheduledWash);