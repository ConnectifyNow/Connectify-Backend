import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import { BaseController } from "./base.controller";
import OrganizationModel, { IOrganization } from "../models/organization";
import { randomAvatarUrl } from "../utils/functions";

export class OrganizationController extends BaseController<IOrganization> {
  constructor(model: Model<IOrganization>) {
    super(model);
  }

  getOrganizationOverview = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { id } = req.params;

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid organization ID" });
      }

      const organization = await this.model
      .findById(id)
      .select([
        "userId",
        "city",
        "name",
        "description",
        "imageUrl",
        "focusAreas",
        "websiteLink"
      ]);

      if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
      }

      return res.status(200).json(organization);
    }
    try {
      const organizations = await this.model
        .find()
        .skip(skip)
        .limit(limit)
        .select([
          "userId",
          "city",
          "name",
          "description",
          "imageUrl",
          "focusAreas",
          "websiteLink"
        ]);

      const total = await this.model.countDocuments();

      res.status(200).json({
        organizations,
        pages: Math.ceil(total / limit)
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getOrganizationsByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
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

  create = async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    try {
      const organization = new this.model({
        ...req.body,
        imageUrl: imageUrl || randomAvatarUrl()
      });

      await organization.save();
      res.status(201).json(organization);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const organizationController = new OrganizationController(OrganizationModel);

export default organizationController;
