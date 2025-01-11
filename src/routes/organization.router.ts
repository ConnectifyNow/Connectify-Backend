import express from "express";
import organizationController from "../controllers/organization.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/:id?",
  authMiddleware,
  organizationController.getOrganizationOverview
);
router.post(
  "/",
  authMiddleware,
  organizationController.create.bind(organizationController)
);
router.put(
  "/:id",
  authMiddleware,
  organizationController.putById.bind(organizationController)
);
router.delete(
  "/:id",
  authMiddleware,
  organizationController.deleteById.bind(organizationController)
);

export default router;
