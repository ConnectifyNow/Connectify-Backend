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
        "phone",
        "firstName",
        "lastName",
        "city",
        "age",
        "skills",
        "imageUrl",
        "about",
        "userId",
      ]);
    }
    return volunteerController.getAll(req, res, [
      "phone",
      "firstName",
      "lastName",
      "city",
      "age",
      "skills",
      "imageUrl",
      "about",
      "userId",
    ]);
  };

  getVolunteersByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "userId isn't valid" });
      }
      const volunteers = await VolunteerModel.find({ userId });
      if (volunteers.length === 0) {
        return res
          .status(404)
          .json({ message: "No volunteers found for this user" });
      }
      return res.status(200).json(volunteers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const volunteerController = new VolunteerController(VolunteerModel);

export default volunteerController;
