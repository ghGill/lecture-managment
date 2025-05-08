const express = require("express");
const router = express.Router()
const lectureController = require("../controllers/lecture");

/**
 * @swagger
 * /lecture/view/{subject}:
 *   get:
 *     tags: [Lectures]
 *     summary: Get lectures by subject with pagination
 *     parameters:
 *       - in: path
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject to filter lectures
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: rows
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of rows per page
 *     responses:
 *       200:
 *         description: List of lectures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lecture'
 */
router.get("/view/:subject", lectureController.getLectures);

module.exports = router

