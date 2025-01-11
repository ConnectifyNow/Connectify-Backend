import { Request, Response } from "express";
import { Model } from "mongoose";
import SkillModel, { ISkill } from "../models/skill";
import { BaseController } from "./base.controller";

export class SkillController extends BaseController<ISkill> {
  constructor(model: Model<ISkill>) {
    super(model);
  }

  getSkillOverview = async (req: Request, res: Response) => {
    if (req.params.id) {
      return skillController.getById(req, res, ["_id", "name"]);
    }
    return skillController.getAll(req, res, ["_id", "name"]);
  };
}

const skillController = new SkillController(SkillModel);

export default skillController;
