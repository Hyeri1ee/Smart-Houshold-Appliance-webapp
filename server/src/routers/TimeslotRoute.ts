import express from "express";
import { putTimeslots, checkTimeslot, deleteTimeslot, deleteDayTimeslot } from "../controllers/user/TimeslotController";

export const timeslotRoute = express.Router();

timeslotRoute.get("/timeslots", checkTimeslot);
timeslotRoute.put("/timeslots/:timeslotId", putTimeslots);
timeslotRoute.delete("/timeslots/:timeslotId", deleteTimeslot);
timeslotRoute.delete("/days/:dayId/timeslots", deleteDayTimeslot);
