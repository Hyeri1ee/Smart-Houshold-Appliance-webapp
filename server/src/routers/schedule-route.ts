import express from "express";
import {putSchedule, checkSchedule} from "../controller/schedule-controller";

export const scheduleRoute = express.Router();

scheduleRoute.get("/", checkSchedule);
scheduleRoute.put("/", putSchedule);