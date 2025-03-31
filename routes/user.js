const express = require("express");
const router = express.Router()
const {db} = require("../database");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /user/view:
 *   get:
 *     tags: [Users]
 *     summary: Get users with pagination
 *     parameters:
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
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/view", async (req, res) => {
    const subject = req.params.subject;
    const page = req.query.page;
    const rows = req.query.rows;

    res.send(await db.getUsers(page, rows));
})

/**
 * @swagger
 * /user/get/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/get/:id", async (req, res) => {
    const id = req.params.id;

    res.send(await db.getUser(id));
})

/**
 * @swagger
 * /user/add:
 *   post:
 *     tags: [Users]
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User added successfully
 */
router.post("/add", (req, res) => {
    const data = req.body;

    res.send(db.addUser(data));
})

/**
 * @swagger
 * /user/update:
 *   put:
 *     tags: [Users]
 *     summary: Update an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/update", (req, res) => {
    const data = req.body;

    res.send(db.updateUser(data));
})

/**
 * @swagger
 * /user/remove/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Remove a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to remove
 *     responses:
 *       200:
 *         description: User removed successfully
 */
router.delete("/remove/:id", (req, res) => {
    const id = req.params.id;

    res.send(db.removeUser(id));
})

module.exports = router

