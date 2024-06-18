import express from "express";

import { handleGet, handlePost } from "../controllers/SolarController";

export const solarRoute = express.Router();

solarRoute.get("/", handleGet);
solarRoute.post("/", handlePost);