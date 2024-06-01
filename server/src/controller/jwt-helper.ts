import { Request } from "express";
import {JwtPayload, verify} from "jsonwebtoken";

export interface UserJwtPayload extends JwtPayload {
      user_id: number;
      first_name: string;
      email: string;
    }

export const handleJwt = (req: Request): JwtPayload => {
  // Check if authorization header is present
  if (!req.headers.authorization) {
    throw Error("No authorization header");
  }

  const auth = req.headers.authorization;

  // Authorization header is present.
  return jwtVerification(auth);
}

const jwtVerification = (auth: string) => {
  let returnValue = <UserJwtPayload> verify(auth, process.env.JWT_KEY!);
  return {
    user_id: returnValue.user_id,
    first_name: returnValue.first_name,
    email: returnValue.email,
  }
}