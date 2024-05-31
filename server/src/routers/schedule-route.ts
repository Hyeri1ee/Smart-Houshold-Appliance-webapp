import express from "express";
import { checkSchedule } from "../controller/scheduleController";

export const scheduleRoute = express.Router();

scheduleRoute.post("/", checkSchedule);