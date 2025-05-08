const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [Users]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User loggedin successfully
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags: [Users]
 *     summary: Register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registred successfully
 */
router.post('/register', userController.register);

module.exports = router
