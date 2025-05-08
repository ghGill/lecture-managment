const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth");
const seqController = require("../controllers/sequelize");

// An example of call endpoint using worker
/*
const { Worker, isMainThread, parentPort } = require('worker_threads');

// Thread mode
if (!isMainThread) {
    parentPort.once('message', async (workerData) => {
        const result = await seqPG[workerData.method](...workerData.params);
        await sleep(5);
        parentPort.postMessage(result);
    });
}

async function sleep(n) {
    return new Promise(async (resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, n * 1000)
    })
}

function createWorker(res, workerData) {
    const worker = new Worker(__filename);

    // Main thread received data
    worker.on('message', (result) => {
        res.send(result);
    });

    worker.on('error', (e) => {
        res.send({ success: false, message: e.message })
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            res.send(`Worker stopped with exit code ${code}`);
        }
    });

    worker.postMessage(workerData);
}

router.get("/crud/:model/:id?", auth.authRolePermission(auth.role_all), async (req, res) => {
    const { model, id } = req.params;

    createWorker(res, { method: 'get', params: [model, id] })
})
*/

/**
 * @swagger
 * /seq/crud/{model}/{id}:
 *   get:
 *     tags: [Sequelize - Entities CRUD]
 *     summary: Get model record/s
 *     description: |
 *       Get model record/s from DB
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *           default: Student
 *           enum:
 *              - Student
 *              - Lecture
 *         description: Define the model name for look up.
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Record id
 *     responses:
 *       200:
 *         description: List of model records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
*/
router.get("/crud/:model/:id?", auth.authRolePermission(auth.role_all), seqController.get)

/**
 * @swagger
 * /seq/crud/{model}:
 *   post:
 *     tags: [Sequelize - Entities CRUD]
 *     summary: Add new record to model table
 *     description: |
 *       Add new record to DB
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *           default: Student
 *           enum:
 *              - Student
 *              - Lecture
 *         description: Define the model name for look up.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Model data as json
 *     responses:
 *       200:
 *         description: The new created record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
*/
router.post("/crud/:model", auth.authRolePermission(auth.role_admin_or_teacher), seqController.insert)

/**
 * @swagger
 * /seq/crud/{model}:
 *   put:
 *     tags: [Sequelize - Entities CRUD]
 *     summary: Update model record
 *     description: |
 *       Update model record in DB
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *           default: Student
 *           enum:
 *              - Student
 *              - Lecture
 *         description: Define the model name for look up.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: The data that we should update in the specific record
 *     responses:
 *       200:
 *         description: The number of effected records [1]
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
*/
router.put("/crud/:model", auth.authRolePermission(auth.role_admin_or_teacher), seqController.update)

/**
 * @swagger
 * /seq/crud/{model}/{id}:
 *   delete:
 *     tags: [Sequelize - Entities CRUD]
 *     summary: Delete model record
 *     description: |
 *       Delete model record from DB
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *           default: Student
 *           enum:
 *              - Student
 *              - Lecture
 *         description: Define the model name for look up.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Record id
 *     responses:
 *       200:
 *         description: The number of effected records [1]
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
*/
router.delete("/crud/:model/:id", auth.authRolePermission(auth.role_admin_or_teacher), seqController.delete)

/**
 * @swagger
 * /seq/session/{lectureId}:
 *   get:
 *     tags: [Sequelize - Session]
 *     summary: Get all lecture sessions
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: false
 *         schema:
 *           type: string
 *           default: 0
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/session/:lectureId?", auth.authRolePermission(auth.role_all), seqController.getSession)

/**
 * @swagger
 * /seq/session/{lectureId}/{time}/{capacity}:
 *   post:
 *     tags: [Sequelize - Session]
 *     summary: Add lecture sessions
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *       - in: path
 *         name: time
 *         required: true
 *         schema:
 *           type: string
 *           default: 10:00
 *           enum:
 *              - 10:00
 *              - 14:00
 *              - 18:00
 *         description: Lecture time
 *       - in: path
 *         name: capacity
 *         required: true
 *         schema:
 *           type: string
 *         description: Session capacity
 *     responses:
 *       200:
 *         description: Lecture session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/session/:lectureId/:time/:capacity", auth.authRolePermission(auth.role_admin_or_teacher), seqController.addSession)

/**
 * @swagger
 * /seq/session:
 *   put:
 *     tags: [Sequelize - Session]
 *     summary: Update session record
 *     description: |
 *       Update session record in DB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: The data we should update the session record
 *     responses:
 *       200:
 *         description: The number of effected records [1]
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
*/
router.put("/session", auth.authRolePermission(auth.role_admin_or_teacher), seqController.updateSession)

/**
 * @swagger
 * /seq/session/{id}/{lectureId}:
 *   delete:
 *     tags: [Sequelize - Session]
 *     summary: Delete lecture sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *           default: 0
 *         description: Record ID
 *       - in: path
 *         name: lectureId
 *         required: false
 *         schema:
 *           type: string
 *           default: 0
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.delete("/session/:id?/:lectureId?", auth.authRolePermission(auth.role_admin_or_teacher), seqController.deleteSession)

/**
 * @swagger
 * /seq/register/{studentId}/{sessionId}:
 *   post:
 *     tags: [Sequelize - Registraion]
 *     summary: Add lecture sessions
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture session ID
 *     responses:
 *       200:
 *         description: Lecture session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/register/:studentId/:sessionId", auth.authRolePermission(auth.role_all), seqController.registerStudent)

/**
 * @swagger
 * /seq/register/{studentId}/{sessionId}:
 *   delete:
 *     tags: [Sequelize - Registraion]
 *     summary: Delete student registration
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture session ID
 *     responses:
 *       200:
 *         description: Lecture session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.delete("/register/:studentId/:sessionId", auth.authRolePermission(auth.role_admin_or_teacher), seqController.unRegisterStudent)

/**
 * @swagger
 * /seq/register/lectures/{studentId}:
 *   get:
 *     tags: [Sequelize - Registraion]
 *     summary: Get all student lecture
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Lecture session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/register/lectures/:studentId", auth.authRolePermission(auth.role_admin_or_teacher), seqController.getStudentLectures)

/**
 * @swagger
 * /seq/register/students/{sessionId}:
 *   get:
 *     tags: [Sequelize - Registraion]
 *     summary: Get all students in lecture session
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: All students in session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/register/students/:sessionId", auth.authRolePermission(auth.role_admin_or_teacher), seqController.getSessionStudents)

/**
 * @swagger
 * /seq/advanced/session-info:
 *   get:
 *     tags: [Sequelize - Advanced]
 *     summary: Get all sessions info
 *     responses:
 *       200:
 *         description: return count of students registred for each session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/advanced/session-info", auth.authRolePermission(auth.role_admin), seqController.getSessionsInfo)

/**
 * @swagger
 * /seq/advanced/students-info:
 *   get:
 *     tags: [Sequelize - Advanced]
 *     summary: Get all students info
 *     responses:
 *       200:
 *         description: return for each student the lecture session he is attend
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/advanced/students-info", auth.authRolePermission(auth.role_admin), seqController.getStudentsInfo)

/**
 * @swagger
 * /seq/advanced/full-sessions:
 *   get:
 *     tags: [Sequelize - Advanced]
 *     summary: Get all students info
 *     responses:
 *       200:
 *         description: return for each student the lecture session he is attend
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/advanced/full-sessions", auth.authRolePermission(auth.role_admin), seqController.getFullSessions)

/**
 * @swagger
 * /seq/advanced/search-sessions/{fieldName}/{text}:
 *   get:
 *     tags: [Sequelize - Advanced]
 *     summary: Get all students info
 *     parameters:
 *       - in: path
 *         name: fieldName
 *         required: true
 *         schema:
 *           type: string
 *           default: name
 *           enum:
 *              - name
 *              - date
 *         description: Select the field to look at.
 *       - in: path
 *         name: text
 *         required: true
 *         schema:
 *           type: string
 *         description: The text to look for in selected field
 *     responses:
 *       200:
 *         description: return for each student the lecture session he is attend
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/advanced/search-sessions/:fieldName/:text", auth.authRolePermission(auth.role_admin_or_teacher), seqController.searchSessions)

module.exports = router
