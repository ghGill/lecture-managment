const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth");
const userController = require("../controllers/user");
const lectureController = require("../controllers/lecture");

// ******************************************* USERS ********************************************************

/**
 * @swagger
 * /auth/user/view/{role}:
 *   get:
 *     tags: [Authentications]
 *     summary: Get users with pagination (Admin or Teacher)
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Get a list of users with pagination support.
 *       Requires a valid JWT token in the Authorization header.
 *       Example: Authorization: Bearer <your-token>
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
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           default: All
 *           enum:
 *              - All
 *              - Admin
 *              - Teacher
 *              - Student
 *         description: Look for users by specific role.
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized - Invalid or missing token"
 */
router.get("/user/view/:role", auth.authRolePermission(auth.role_admin_or_teacher), userController.getUsers)

/**
 * @swagger
 * /auth/user/get/{id}:
 *   get:
 *     tags: [Authentications]
 *     summary: Get user by ID (Admin or Teacher)
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
router.get("/user/get/:id", auth.authRolePermission(auth.role_admin_or_teacher), userController.getUser);

/**
 * @swagger
 * /auth/user/add:
 *   post:
 *     tags: [Authentications]
 *     summary: Add a new user (Admin)
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
router.post("/user/add", auth.authRolePermission(auth.role_admin), userController.register);

/**
 * @swagger
 * /auth/user/update:
 *   put:
 *     tags: [Authentications]
 *     summary: Update an existing user (Admin)
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
router.put("/user/update", auth.authRolePermission(auth.role_admin), userController.updateUser);

/**
 * @swagger
 * /auth/user/remove/{id}:
 *   delete:
 *     tags: [Authentications]
 *     summary: Remove a user by ID (Admin)
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
router.delete("/user/remove/:id", auth.authRolePermission(auth.role_admin), userController.removeUser);

// ******************************************* LECTURES ********************************************************

/**
 * @swagger
 * /auth/lecture/add:
 *   post:
 *     tags: [Authentications]
 *     summary: Add a new lecture (Admin or Teacher)
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
router.post("/lecture/add", auth.authRolePermission(auth.role_admin_or_teacher), lectureController.addLecture);

/**
 * @swagger
 * /auth/lecture/update:
 *   put:
 *     tags: [Authentications]
 *     summary: Update an existing lecture (Admin or Teacher)
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
router.put("/lecture/update", auth.authRolePermission(auth.role_admin_or_teacher), lectureController.updateLecture);

/**
 * @swagger
 * /auth/lecture/remove/{id}:
 *   delete:
 *     tags: [Authentications]
 *     summary: Remove a lecture by ID (Admin or Teacher)
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
router.delete("/lecture/remove/:id", auth.authRolePermission(auth.role_admin_or_teacher), lectureController.removeLecture);

module.exports = router
