import express from "express";
<<<<<<< HEAD
import {putSchedule, checkSchedule,saveSchedule} from "../controllers/ScheduleController";

export const scheduleRoute = express.Router();

scheduleRoute.get("/", checkSchedule);
scheduleRoute.put("/", putSchedule);
scheduleRoute.post("/", saveSchedule);
=======
import {addScheduledWash, deleteScheduledWash, getScheduledWash} from "../controllers/ScheduleController";

export const scheduleRoute = express.Router();

scheduleRoute.get('/', getScheduledWash)
scheduleRoute.post('/', addScheduledWash);
scheduleRoute.delete('/', deleteScheduledWash);
>>>>>>> origin/development
