import express from 'express';
import {getOutputPrediction, handleCreateLocation, handleSolarPanelCreation} from "../controller/LocationController.js";

export const locationsRoutes = express.Router();
export const locationRoutes = express.Router();

locationsRoutes.post('/', handleCreateLocation);
locationRoutes.post(`/:location_id/panels`, handleSolarPanelCreation);
locationRoutes.post(`/:location_id/data`, getOutputPrediction);