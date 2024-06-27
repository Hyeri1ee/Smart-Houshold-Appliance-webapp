import express from "express";
import {getProfiletype} from "../controllers/SettingController";

export const  settingRoute = express.Router();

settingRoute.get("/", getProfiletype);
