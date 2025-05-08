const express = require("express");
const router = express.Router()
const axiosController = require("../controllers/axios");

/**
 * @swagger
 * /axios/search/{keys}:
 *   get:
 *     tags: [Axios]
 *     summary: Get books by keys
 *     description: |
 *       Get a list of books from openLib 
 *     parameters:
 *       - in: path
 *         name: keys
 *         required: true
 *         schema:
 *           type: string
 *         description: Keys to look for
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/search/:keys", axiosController.search);

module.exports = router

