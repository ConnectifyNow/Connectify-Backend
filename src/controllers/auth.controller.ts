import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

const signup = async (req: Request, res: Response) => {
  const { name, email, password, type, bio } = req.body;

  if (!name || !email || !password || !type || !bio)
    return res.status(400).send("can't register the user - missing info");

  try {
    const response = await User.findOne({ email: email });
    if (response != null) return res.status(406).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

  generateTokens = async (user: IUser) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );

    if (user.refreshTokens == null) user.refreshTokens = [refreshToken];
    else user.refreshTokens.push(refreshToken);

    await user.save();
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  };

const generateTokens = async (user: IUser) => {
  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET
  );

  if (user.refreshTokens == null) user.refreshTokens = [refreshToken];
  else user.refreshTokens.push(refreshToken);

  await user.save();
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

  logout = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
      async (err, user: { _id: string }) => {
        if (err) {
          return res.sendStatus(401);
        }

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        return res.sendStatus(401);
      }

      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb?.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (t: string) => t !== refreshToken
          );
          await userDb.save();
          return res.status(200).send("Logout successfully");
        }
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        return res.sendStatus(401);
      }

      try {
        const userDb = await User.findOne({ _id: user._id });
        if (!userDb) {
          return res.status(401).send("User not found in the database");
        }

        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        }

        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
        );

        userDb.refreshTokens = userDb.refreshTokens.filter(
          (t: string) => t !== refreshToken
        );
        userDb.refreshTokens.push(newRefreshToken);

        await userDb.save();

        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: newRefreshToken,
        });
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }
  );
};

export default {
  signin,
  generateTokens,
  signup,
  logout,
  refresh,
  
};
