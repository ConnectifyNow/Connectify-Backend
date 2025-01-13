import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType> {
  model: Model<ModelType>;
  constructor(model: Model<ModelType>) {
    this.model = model;
  }

  getAll = async (req: Request, res: Response, selectFields?: string[]) => {
    try {
      const model = await this.model.find().select(selectFields || {});

      if (model.length === 0) {
        return res.status(404).json({ message: "Model not found" });
      }

      res.send(model);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getAllPopulated = async (
    req: Request,
    res: Response,
    populateFields: string[]
  ) => {
    try {
      const model = await this.model.find().populate(populateFields);

      if (model.length === 0) {
        return res.status(404).json({ message: "Model not found" });
      }

      res.send(model);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getById = async (req: Request, res: Response, selectFields?: string[]) => {
    try {
      const id = req.params.id;
      const query = id ? { _id: id } : {};

      const model = await this.model.find(query).select(selectFields || {});

      if (model.length === 0) {
        return res.status(404).json({ message: "Model not found" });
      }

      res.send(model[0]);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const obj = await this.model.create(req.body);
      res.status(201).send(obj);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const obj = await this.model.findByIdAndDelete(id);

      if (!obj) return res.status(404).json({ error: "Model not found" });

      res.status(200).send({ message: "Model deleted successfully" });
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  putById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updateFields = req.body;

      const updateModel = await this.model.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
      );

      if (!updateModel) {
        return res.status(404).json({ error: "Model not found" });
      }

      res.status(200).send(updateModel);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };
}

const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseController<ModelType>(model);
};

export { createController };
