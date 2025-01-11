import express from "express";
import organizationController from "../controllers/organization.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id?", organizationController.getOrganizationOverview);
router.get("/user/:userId", organizationController.getOrganizationsByUserId);
router.post("/", organizationController.create.bind(organizationController));
router.put("/:id", organizationController.putById.bind(organizationController));
router.delete(
  "/:id",
  organizationController.deleteById.bind(organizationController)
);

export default router;
