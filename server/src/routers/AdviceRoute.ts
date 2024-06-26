import express from "express";
import { assignSchedulesToPeakTimes } from "../controllers/auth/AdviceController";

export const  adviceRoute = express.Router();

adviceRoute.get("/", assignSchedulesToPeakTimes);