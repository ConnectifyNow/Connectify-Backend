import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import FocusAreaModel, { IFocusArea } from "../models/focusArea";
import { BaseController } from "./base.controller";

export class FocusAreaController extends BaseController<IFocusArea> {
  constructor(model: Model<IFocusArea>) {
    super(model);
  }

  getFocusAreas = async (req: Request, res: Response) => {
    if (req.params.id) {
      return focusAreaController.getById(req, res, ["_id", "name"]);
    }
    return focusAreaController.getAll(req, res, ["_id", "name"]);
  };
}

const focusAreaController = new FocusAreaController(FocusAreaModel);

export default focusAreaController;
