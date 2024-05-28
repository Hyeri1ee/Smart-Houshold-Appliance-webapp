import express, { Request, Response } from "express";

import { handleGet, handlePost } from "../handlers/solar-handler";

export const solarRoute = express.Router();

solarRoute.get("/", handleGet);
solarRoute.post("/", handlePost);