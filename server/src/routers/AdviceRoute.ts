import express from "express";
import { assignSchedulesToPeakTimes } from "../controllers/AdviceController";

export const  adviceRoute = express.Router();

adviceRoute.get("/", assignSchedulesToPeakTimes);