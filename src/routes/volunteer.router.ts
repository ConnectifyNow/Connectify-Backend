import express from "express";
import volunteerController from "../controllers/volunteer.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", volunteerController.getVolunteerOverview);
router.get("/user/:userId", volunteerController.getVolunteersByUserId);
router.post("/", volunteerController.create.bind(volunteerController));
router.put("/:id", volunteerController.putById.bind(volunteerController));
router.delete("/:id", volunteerController.deleteById.bind(volunteerController));

export default router;
