import express from "express";
import skillController from "../controllers/skill.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the skill
 *         name:
 *           type: string
 *           description: The name of the skill
 */

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Internal server error
 */
router.get("/:id?", authMiddleware, skillController.getSkillOverview);

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       201:
 *         description: The created skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, skillController.create.bind(skillController));

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update a skill by ID
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the skill
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       200:
 *         description: The updated skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Invalid skill ID
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authMiddleware,
  skillController.putById.bind(skillController)
);

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete a skill by ID
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the skill
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 *       400:
 *         description: Invalid skill ID
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  skillController.deleteById.bind(skillController)
);

export default router;
