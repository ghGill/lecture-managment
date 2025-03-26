const express = require("express");
const router = express.Router()
const {db} = require("../database");

/**
 * @swagger
 * /lecture/view/{subject}:
 *   get:
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
 *     summary: Add a new lecture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - title
 *             properties:
 *               subject:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
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
 *     summary: Update an existing lecture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               subject:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
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

