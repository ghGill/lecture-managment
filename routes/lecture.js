const express = require("express");
const router = express.Router()
const {db} = require("../database");

/**
 * @swagger
 * tags:
 *   name: Lectures
 *   description: Lecture management endpoints
 */

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
router.get("/view/:subject", async (req, res) => {
    const subject = req.params.subject;
    const page = req.query.page;
    const rows = req.query.rows;

    res.send(await db.getLectures(subject, page, rows));
})

/**
 * @swagger
 * /lecture/add:
 *   post:
 *     tags: [Lectures]
 *     summary: Add a new lecture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lecture'
 *     responses:
 *       200:
 *         description: Lecture added successfully
 */
router.post("/add", (req, res) => {
    const data = req.body;

    res.send(db.addLecture(data));
})

/**
 * @swagger
 * /lecture/update:
 *   put:
 *     tags: [Lectures]
 *     summary: Update an existing lecture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lecture'
 *     responses:
 *       200:
 *         description: Lecture updated successfully
 */
router.put("/update", (req, res) => {
    const data = req.body;

    res.send(db.updateLecture(data));
})

/**
 * @swagger
 * /lecture/remove/{id}:
 *   delete:
 *     tags: [Lectures]
 *     summary: Remove a lecture by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lecture to remove
 *     responses:
 *       200:
 *         description: Lecture removed successfully
 */
router.delete("/remove/:id", (req, res) => {
    const id = req.params.id;

    res.send(db.removeLecture(id));
})

module.exports = router

