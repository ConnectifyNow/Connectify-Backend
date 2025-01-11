import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import { BaseController } from "./base.controller";
import OrganizationModel, { IOrganization } from "../models/organization";

export class OrganizationController extends BaseController<IOrganization> {
  constructor(model: Model<IOrganization>) {
    super(model);
  }

  getOrganizationOverview = async (req: Request, res: Response) => {
    if (req.params.id) {
      return organizationController.getById(req, res, [
        "_id",
        "city",
        "name",
        "description",
        "imageUrl",
        "userId",
        "focusAreas",
        "websiteLink",
      ]);
    }
    return organizationController.getAll(req, res, [
      "_id",
      "city",
      "name",
      "description",
      "imageUrl",
      "userId",
      "focusAreas",
      "websiteLink",
    ]);
  };
}

const organizationController = new OrganizationController(OrganizationModel);

export default organizationController;
