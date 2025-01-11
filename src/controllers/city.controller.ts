import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import CityModel, { ICity } from "../models/city";
import { BaseController } from "./base.controller";

export class CityController extends BaseController<ICity> {
  constructor(model: Model<ICity>) {
    super(model);
  }

  getCitiesOverview = async (req: Request, res: Response) => {
    if (req.params.id) {
      return cityController.getById(req, res, ["_id", "name"]);
    }
    return cityController.getAll(req, res, ["_id", "name"]);
  };
  //   async create(req: Request, res: Response) {
  //     try {
  //       const { user } = req;
  //       req.body = { ...req.body, userId: user._id };

  //       const newCity = await super.create(req, res);
  //       res.status(200).send(newCity);
  //     } catch (err) {
  //       res.status(500).json({ message: err.message });
  //     }
  //   }

  getCitiesByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "userId isn't valid" });
      }
      const cities = await CityModel.find({ userId });
      if (cities.length === 0) {
        return res
          .status(404)
          .json({ message: "No cities found for this user" });
      }
      return res.status(200).json(cities);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const cityController = new CityController(CityModel);

export default cityController;
