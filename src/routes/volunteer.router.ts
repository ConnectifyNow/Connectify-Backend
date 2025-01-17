import express from "express";
import volunteerController from "../controllers/volunteer.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Volunteer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the volunteer
 *         userId:
 *           type: string
 *           description: The id of the user associated with the volunteer
 *         firstName:
 *           type: string
 *           description: The first name of the volunteer
 *         lastName:
 *           type: string
 *           description: The last name of the volunteer
 *         phone:
 *           type: string
 *           description: The phone number of the volunteer
 *         city:
 *           type: string
 *           description: The city of the volunteer
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: The skills of the volunteer
 *         imageUrl:
 *           type: string
 *           description: The image URL of the volunteer
 *         about:
 *           type: string
 *           description: Information about the volunteer
 */

/**
 * @swagger
 * /api/volunteers:
 *   get:
 *     summary: Get all volunteers
 *     tags: [Volunteer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all volunteers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Volunteer'
 *       500:
 *         description: Internal server error
 */
router.get("/:id?", authMiddleware, volunteerController.getVolunteerOverview);

/**
 * @swagger
 * /api/volunteers/user/{userId}:
 *   get:
 *     summary: Get volunteers by user ID
 *     tags: [Volunteer]
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
 *         description: List of volunteers for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Volunteer'
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: No volunteers found for this user
 *       500:
 *         description: Internal server error
 */
router.get(
  "/user/:userId",
  authMiddleware,
  volunteerController.getVolunteersByUserId
);

/**
 * @swagger
 * /api/volunteers:
 *   post:
 *     summary: Create a new volunteer
 *     tags: [Volunteer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       201:
 *         description: The created volunteer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authMiddleware,
  volunteerController.create.bind(volunteerController)
);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   put:
 *     summary: Update a volunteer by ID
 *     tags: [Volunteer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the volunteer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       200:
 *         description: The updated volunteer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *       400:
 *         description: Invalid volunteer ID
 *       404:
 *         description: Volunteer not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authMiddleware,
  volunteerController.putById.bind(volunteerController)
);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   delete:
 *     summary: Delete a volunteer by ID
 *     tags: [Volunteer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the volunteer
 *     responses:
 *       200:
 *         description: Volunteer deleted successfully
 *       400:
 *         description: Invalid volunteer ID
 *       404:
 *         description: Volunteer not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  volunteerController.deleteById.bind(volunteerController)
);

export default router;
