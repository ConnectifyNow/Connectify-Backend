import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import VolunteerModel from "../models/volunteer";
import { IVolunteer } from "../models/volunteer";
import { BaseController } from "./base.controller";

export class VolunteerController extends BaseController<IVolunteer> {
  constructor(model: Model<IVolunteer>) {
    super(model);
  }

  getVolunteerOverview = async (req: Request, res: Response) => {
    if (req.params.id) {
      return volunteerController.getById(req, res, [
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
    return volunteerController.getAll(req, res, [
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

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "userId isn't valid" });
      }
      const organizations = await VolunteerModel.find({ userId });
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

const volunteerController = new VolunteerController(VolunteerModel);

export default volunteerController;
