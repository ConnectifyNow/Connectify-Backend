import express from "express";
import organizationController from "../controllers/organization.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the organization
 *         userId:
 *           type: string
 *           description: The id of the user who created the organization
 *         city:
 *           type: string
 *           description: The city of the organization
 *         name:
 *           type: string
 *           description: The name of the organization
 *         description:
 *           type: string
 *           description: The description of the organization
 *         imageUrl:
 *           type: string
 *           description: The image URL of the organization
 *         focusAreas:
 *           type: array
 *           items:
 *             type: string
 *           description: The focus areas of the organization
 *         websiteLink:
 *           type: string
 *           description: The website link of the organization
 */

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id?",
  authMiddleware,
  organizationController.getOrganizationOverview
);

/**
 * @swagger
 * /api/organizations/user/{userId}:
 *   get:
 *     summary: Get organizations by user ID
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user
 *     responses:
 *       200:
 *         description: List of organizations for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: No organizations found for this user
 *       500:
 *         description: Internal server error
 */
router.get(
  "/user/:userId",
  authMiddleware,
  organizationController.getOrganizationsByUserId
);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       201:
 *         description: The created organization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authMiddleware,
  organizationController.create.bind(organizationController)
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   put:
 *     summary: Update an organization by ID
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the organization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       200:
 *         description: The updated organization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Invalid organization ID
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authMiddleware,
  organizationController.putById.bind(organizationController)
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   delete:
 *     summary: Delete an organization by ID
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the organization
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *       400:
 *         description: Invalid organization ID
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  organizationController.deleteById.bind(organizationController)
);

export default router;
