import { Request, Response } from "express";
import {handleJwt} from "./jwt-helper";

export const handleGet = (req: Request, res: Response): void => {
  let decoded;
  try {
    decoded = handleJwt(req);
    if (decoded === undefined) {
      throw new Error("Something went wrong when authenticating. Please try sign in again.");
    }
  } catch(e: unknown) {
    if (e instanceof Error) {
      res
        .status(400)
        .json({
          message: "Bad Request",
          error: e.message,
        });
    }

    res.sendStatus(400);
    return;
  }

  decoded.userId

  res
    .status(302)
    .json({message: "found"});
}

export const handlePost = (req: Request, res: Response): void => {

  res
    .status(302)
    .json({message: "found"});
}