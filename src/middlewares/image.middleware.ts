import multer from "multer";
import { Request } from "express";

const maxSize = 10 * 1024 * 1024; // 10MB

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req: Request, file, cb) {
      cb(null, "public/");
    },
    // destination: function (req, file, cb) {
    //   const uploadPath = path.join("..", "..", "Connectify-Backend", "public");

    //   cb(null, uploadPath); // Set the destination for file uploads
    // },
    filename: function (req: Request, file, cb) {
      const ext = file.originalname
        .split(".")
        .filter(Boolean)
        .slice(1)
        .join(".");
      cb(null, Date.now() + "." + ext);
    },
  }),
  limits: { fileSize: maxSize },
});

export default upload;
