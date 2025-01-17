import express from "express";
import focusAreaController from "../controllers/focusArea.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FocusArea:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the focus area
 *         name:
 *           type: string
 *           description: The name of the focus area
 */

/**
 * @swagger
 * /api/focus-areas:
 *   get:
 *     summary: Get all focus areas
 *     tags: [FocusArea]
 *     responses:
 *       200:
 *         description: List of all focus areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FocusArea'
 *       500:
 *         description: Internal server error
 */
router.get("/:id?", focusAreaController.getFocusAreas);

/**
 * @swagger
 * /api/focus-areas:
 *   post:
 *     summary: Create a new focus area
 *     tags: [FocusArea]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FocusArea'
 *     responses:
 *       201:
 *         description: The created focus area
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FocusArea'
 *       500:
 *         description: Internal server error
 */
router.post("/", focusAreaController.create.bind(focusAreaController));

/**
 * @swagger
 * /api/focus-areas/{id}:
 *   put:
 *     summary: Update a focus area by ID
 *     tags: [FocusArea]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the focus area
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FocusArea'
 *     responses:
 *       200:
 *         description: The updated focus area
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FocusArea'
 *       400:
 *         description: Invalid focus area ID
 *       404:
 *         description: Focus area not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", focusAreaController.putById.bind(focusAreaController));

/**
 * @swagger
 * /api/focus-areas/{id}:
 *   delete:
 *     summary: Delete a focus area by ID
 *     tags: [FocusArea]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the focus area
 *     responses:
 *       200:
 *         description: Focus area deleted successfully
 *       400:
 *         description: Invalid focus area ID
 *       404:
 *         description: Focus area not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", focusAreaController.deleteById.bind(focusAreaController));

export default router;
