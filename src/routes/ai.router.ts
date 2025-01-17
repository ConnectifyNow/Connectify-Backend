import express from "express";
import aiController from "../controllers/ai.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AiDescription:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           description: The AI-generated description for the organization
 */

/**
 * @swagger
 * /api/ai/{orgName}:
 *   get:
 *     summary: Get AI-generated description for an organization
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the organization
 *     responses:
 *       200:
 *         description: AI-generated description for the organization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiDescription'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/:orgName", authMiddleware, aiController.getAiDescription);

export default router;
