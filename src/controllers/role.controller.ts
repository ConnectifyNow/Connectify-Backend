import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import RoleModel, { IRole } from "../models/role";
import { BaseController } from "./base.controller";

export class RoleController extends BaseController<IRole> {
    constructor(model: Model<IRole>) {
        super(model);
    }

    getRoleOverview = async (req: Request, res: Response) => {
        if (req.params.id) {
            return roleController.getById(req, res, ["_id", "name"]);
        }
        return roleController.getAll(req, res, ["_id", "name"]);
    };

    getRoleByName = async (req: Request, res: Response) => {
        try {
            const roleName = req.params.name;

            if (!roleName) {
                return res.status(400).send({ error: "Role name is required" });
            }
            const role = await RoleModel.findOne({ name: roleName });
            if (!role) {
                return res.status(404).json({ message: "Role not found" });
            }
            return res.status(200).json(role);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
}

const roleController = new RoleController(RoleModel);

export default roleController;