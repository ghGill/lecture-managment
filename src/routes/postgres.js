const express = require("express");
const router = express.Router()
const {pg} = require("../services/pg");

/**
 * @swagger
 * tags:
 *   name: Lectures
 *   description: Lecture management endpoints
 */

/**
 * @swagger
 * /pg/query:
 *   post:
 *     tags: [Postgres]
 *     summary: Execute query
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             $ref: '#/components/schemas/Postgres'
 *     responses:
 *       200:
 *         description: Execute query in Postgres
 */
router.post("/query", async (req, res) => {
    const query = req.body;

    const result = await pg.execQuery(query);

    res.send(result);
})

module.exports = router

