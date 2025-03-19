import express from "express";
import cityController from "../controllers/city.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the city
 *         name:
 *           type: string
 *           description: The name of the city
 */

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Get all cities
 *     tags: [City]
 *     responses:
 *       200:
 *         description: List of all cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       500:
 *         description: Internal server error
 */

router.get("/", cityController.getCitiesOverview);
/**
 * @swagger
 * /api/cities:
 *   post:
 *     summary: Create a new city
 *     tags: [City]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       201:
 *         description: The created city
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       500:
 *         description: Internal server error
 */
router.post("/", cityController.createCity);
export default router;
