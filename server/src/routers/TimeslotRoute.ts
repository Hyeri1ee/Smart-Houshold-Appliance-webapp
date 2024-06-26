import express from "express";
import { putTimeslot, checkTimeslot, deleteTimeslot, deleteDayTimeslot } from "../controllers/TimeslotController";

export const timeslotRoute = express.Router();

timeslotRoute.get("/timeslots", checkTimeslot);
timeslotRoute.put("/timeslots/:timeslotId", putTimeslot);
timeslotRoute.delete("/timeslots/:timeslotId", deleteTimeslot);
timeslotRoute.delete("/days/:dayId/timeslots", deleteDayTimeslot);
