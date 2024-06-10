import express from 'express';
import {handleCreateLocation} from "../controller/LocationController.js";

export const locationRoutes = express.Router();

locationRoutes.post('/', handleCreateLocation);