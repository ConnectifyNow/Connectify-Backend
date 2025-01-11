import express from "express";
import volunteerController from "../controllers/volunteer.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", authMiddleware, volunteerController.getVolunteerOverview);
router.get(
  "/user/:userId",
  authMiddleware,
  volunteerController.getVolunteersByUserId
);
router.post(
  "/",
  authMiddleware,
  volunteerController.create.bind(volunteerController)
);
router.put(
  "/:id",
  authMiddleware,
  volunteerController.putById.bind(volunteerController)
);
router.delete(
  "/:id",
  authMiddleware,
  volunteerController.deleteById.bind(volunteerController)
);

export default router;
