import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import VolunteerModel from "../models/volunteer";
import { IVolunteer } from "../models/volunteer";
import { BaseController } from "./base.controller";
import { randomAvatarUrl } from "../utils/functions";

export class VolunteerController extends BaseController<IVolunteer> {
  constructor(model: Model<IVolunteer>) {
    super(model);
  }

  getVolunteerOverview = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = req.query.search as string || '';
    const skip = (page - 1) * limit;
    const { id } = req.params;
  
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid volunteer ID" });
      }
      
      try {
        const volunteer = await VolunteerModel.findById(id).select([
          "userId",
          "firstName",
          "lastName",
          "phone",
          "city",
          "age",
          "skills",
          "imageUrl",
          "about"
        ]);
  
        if (!volunteer) {
          return res.status(404).json({ message: "Volunteer not found" });
        }
  
        return res.status(200).json(volunteer);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }
    
    try {
      const searchFilter = searchTerm 
        ? { 
            $or: [
              { firstName: { $regex: searchTerm, $options: 'i' } },
              { lastName: { $regex: searchTerm, $options: 'i' } }
            ] 
          } 
        : {};
      
      const volunteers = await VolunteerModel.find(searchFilter)
        .skip(skip)
        .limit(limit)
        .select([
          "userId",
          "firstName",
          "lastName",
          "phone",
          "city",
          "age",
          "skills",
          "imageUrl",
          "about"
        ]);
  
      const total = await VolunteerModel.countDocuments(searchFilter);
  
      res.status(200).json({
        volunteers,
        pages: Math.ceil(total / limit)
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
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

  create = async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    try {
      const volunteer = new this.model({
        ...req.body,
        imageUrl: imageUrl || randomAvatarUrl()
      });

      await volunteer.save();
      res.status(201).json(volunteer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const volunteerController = new VolunteerController(VolunteerModel);

export default volunteerController;
