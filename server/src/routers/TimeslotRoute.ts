import express from "express";
import { putTimeslot, checkTimeslot, deleteTimeslot, deleteDayTimeslot } from "../controllers/TimeslotController";

export const timeslotRoute = express.Router();

timeslotRoute.get("/getTimeslots", checkTimeslot);
timeslotRoute.put("/putTimeslot", putTimeslot);
timeslotRoute.delete("/deleteTimeslot", deleteTimeslot);
timeslotRoute.delete("/deleteDay/:dayId", deleteDayTimeslot);
