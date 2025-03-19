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

  createCity = async (req: Request, res: Response) => {
    return cityController.create(req, res);
  };
}

const cityController = new CityController(CityModel);

export default cityController;
