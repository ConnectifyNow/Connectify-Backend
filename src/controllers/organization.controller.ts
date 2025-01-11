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

  getOrganizationsByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).send({ error: "userId isn't valid" });
      }
      const organizations = await OrganizationModel.find({ userId });
      if (organizations.length === 0) {
        return res
          .status(404)
          .json({ message: "No organizations found for this user" });
      }
      return res.status(200).json(organizations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const organizationController = new OrganizationController(OrganizationModel);

export default organizationController;
