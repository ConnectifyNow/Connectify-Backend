import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Role } from "../types";
import Volunteer from "../models/volunteer";
import Organization from "../models/organization";

const client = new OAuth2Client();

const logInGoogle = async (req: Request, res: Response) => {
  const { credentialResponse } = req.body;
  const credential = credentialResponse.credential;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    const { name, email, given_name, family_name, picture } = payload;

    let user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        role: Role.Volunteer
      });

      await Volunteer.create({
        userId: user._id,
        firstName: given_name,
        lastName: family_name,
        imageUrl: picture
      });
    }

    const volunteer = await Volunteer.findOne({ userId: user._id });

    const tokens = await generateTokens(user);
    return res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        _id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        volunteer
      }
    });
  } catch (err) {
    return res.status(500).send("Invalid Google credential");
  }
};

const register = async (req: Request, res: Response) => {
  const { username, email, password, role, withCreation } = req.body;

  if (!username || !password || role === undefined)
    return res.status(400).send("can't register the user - missing info");

  try {
    const response = await User.findOne({ username });
    if (response != null) return res.status(406).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    if (withCreation) {
      const user = await User.create({
        username,
        email,
        password: encryptedPassword,
        role
      });

      const userObject = user.toObject();
      delete userObject.password;
      return res.status(201).send(userObject);
    }

    return res.status(201).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const generateTokens = async (user: IUser) => {
  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
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
    refreshToken: refreshToken
  };
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send("missing username or password");

  try {
    const user = await User.findOne({ username });
    if (user == null)
      return res.status(401).send("username or password incorrect");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("username or password incorrect");

    const tokens = await generateTokens(user);

    const volunteer = await Volunteer.findOne({ userId: user._id });
    const organization = await Organization.findOne({ userId: user._id });

    return res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        _id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        volunteer,
        organization
      }
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

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
            (token: string) => token !== refreshToken
          );
          await userDb.save();
          return res.status(200).send("Logout successful");
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
          refreshToken: newRefreshToken
        });
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }
  );
};

export default {
  logInGoogle,
  register,
  login,
  logout,
  refresh
};
