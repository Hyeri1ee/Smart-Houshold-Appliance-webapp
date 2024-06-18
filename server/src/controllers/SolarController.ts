import {Request, Response} from "express";
import {handleJwt} from "./JWTHelper";
import {getDataSource} from "../db/DatabaseConnect";
import {User} from "../db/entities/User";
import {SolarSetup} from "../db/entities/SolarSetup";

// @ts-ignore
const findUser = async (req: Request, res: Response): User | null => {
  let decoded;
  try {
    decoded = handleJwt(req);
    if (decoded === undefined) {
      throw new Error("Something went wrong when authenticating. Please try sign in again.");
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      res
        .status(400)
        .json({
          message: "Bad Request",
          error: e.message,
        });
    }

    res.sendStatus(400);
    return null;
  }

  const user: User | null =
    await (await getDataSource()).getRepository(User).findOne(
      {
        where: {user_id: decoded.user_id}
      }
    );

  if (user === null) {
    res.sendStatus(403);
    return null;
  }

  return user;
}

export const handleGet = async (req: Request, res: Response): Promise<void> => {
  const user: User | null = findUser(req, res);
  if (user === null) {
    return;
  }

  let userSolarSetup: SolarSetup | null;

  try {
    userSolarSetup = user.location.solar_setup
  } catch (e) {
    res.sendStatus(500);
    return;
  }

  try {
    res
      .status(200)
      .json({
        data: [
          {
            panel_count: userSolarSetup?.panel_count,
            panel_type: userSolarSetup?.panel_type,
            panel_area: userSolarSetup?.panel_area,
            tilt: userSolarSetup?.tilt,
            azimuth: userSolarSetup?.azimuth,
            peak_power: userSolarSetup?.peak_power,
          }
        ]
      });

    return;
  } catch (e) {
    res
      .status(400)
      .json({
        message: "Solar setup is incomplete."
      });

    return;
  }
}

export const handlePost = (req: Request, res: Response): void => {
  const user: User | null = findUser(req, res);
  if (user === null) {
    return;
  }

  let userSolarSetup: SolarSetup;
  try {
    userSolarSetup = user.location.solar_setup
  } catch (e) {
    res.sendStatus(500);
    return;
  }

  try {
    userSolarSetup.panel_count = req.body.panel_count;
    userSolarSetup.panel_type = req.body.panel_type;
    userSolarSetup.panel_area = req.body.panel_area;
    userSolarSetup.tilt = req.body.tilt;
    userSolarSetup.azimuth = req.body.azimuth;
    userSolarSetup.peak_power = req.body.peak_power;

    res
      .status(201)
      .json({
        message: "Successfully made solar setup for " + user.first_name
      })
    return;
  } catch (e: unknown) {
    if (e instanceof Error) {
      res
        .status(400)
        .json({
          message: "Some part of the solar setup is missing.",
          error: e.message,
        });
    }

    res.sendStatus(400);
    return;
  }
}