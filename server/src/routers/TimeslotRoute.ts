import express from "express";
import {checkTimeslots, putTimeslots} from "../controllers/user/TimeslotController";

export const timeslotRoute = express.Router();

timeslotRoute.get('/', checkTimeslots)
timeslotRoute.post('/', putTimeslots);