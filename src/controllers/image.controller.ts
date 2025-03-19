import { Request, Response } from "express";
import { BASE_URL } from "../utils/constants";

const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image file provided.");
    }

    const originalName = req.file.originalname;
    const serverFilename = BASE_URL + req.file.path.replace(/\\/g, "/");

    res.status(200).send({ originalName, serverFilename });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default {
  uploadImage
};
