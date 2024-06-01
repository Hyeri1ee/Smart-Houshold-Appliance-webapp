import express from "express";
import { checkSchedule } from "../controller/schedule-controller";

export const scheduleRoute = express.Router();

scheduleRoute.post("/", checkSchedule);