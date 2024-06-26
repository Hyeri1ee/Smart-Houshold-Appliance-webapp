import express from "express";
import {addScheduledWash, deleteScheduledWash, getScheduledWash} from "../controllers/ScheduleController";

export const scheduleRoute = express.Router();

scheduleRoute.get('/', getScheduledWash)
scheduleRoute.post('/', addScheduledWash);
scheduleRoute.delete('/', deleteScheduledWash);
