
import express from 'express';
import * as locationController from '../controller/controller.js';

const router = express.Router();

router.get("/locations", locationController.getAllLocations); // GET /locations - Get all locations
router.get("/locations/id", locationController.getLocationById); // GET /locations/id - Get location by ID but not really

router.get("/locations/id/panels", locationController.getPanelsByLocation); // GET /locations/id/panels - Get all panels for a location

router.get("/locations/id/data", locationController.getData); // GET /locations/id/data - Get data for a location
router.get("/locations/interval/data", locationController.getIntervalData); // GET /locations/interval/data - Get interval data


export default router;
