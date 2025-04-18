const express = require("express");
const router = express.Router()
const {redis} = require("../services/redis");

/**
 * @swagger
 * /redis/put/{key}/{val}:
 *   get:
 *     summary: Store a key-value pair in Redis
 *     tags: [Redis]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key to store
 *       - in: path
 *         name: val
 *         required: true
 *         schema:
 *           type: string
 *         description: The value to store
 *     responses:
 *       200:
 *         description: Successfully stored the key-value pair
 */
router.get("/put/:key/:val", async (req, res) => {
    const key = req.params.key;
    const val = req.params.val;

    const result = await redis.put(key, val);

    res.send(result);
})

/**
 * @swagger
 * /redis/get/{key}:
 *   get:
 *     summary: Retrieve a value from Redis by key
 *     tags: [Redis]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the value
 */
router.get("/get/:key", async (req, res) => {
    const key = req.params.key;

    const result = await redis.get(key);

    if (!result)
        res.send(`Key ${key} not found in cache.`)

    res.send(result);
})

/**
 * @swagger
 * /redis/exist/{key}:
 *   get:
 *     summary: Check if a key exists in Redis
 *     tags: [Redis]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key to check
 *     responses:
 *       200:
 *         description: Successfully checked key existence
 */
router.get("/exist/:key", async (req, res) => {
    const key = req.params.key;

    const result = await redis.exist(key);

    res.send((result == 0) ? "false" : "true");
})

/**
 * @swagger
 * /redis/keys:
 *   get:
 *     summary: Get all keys from Redis
 *     tags: [Redis]
 *     responses:
 *       200:
 *         description: Successfully retrieved all keys
 */
router.get("/keys", async (req, res) => {
    const result = await redis.getAllKeys();

    res.send(result);
})

/**
 * @swagger
 * /redis/clear:
 *   get:
 *     summary: Clear all keys from Redis
 *     tags: [Redis]
 *     responses:
 *       200:
 *         description: Successfully clear all keys
 */
router.get("/clear", async (req, res) => {
    const result = await redis.clear();

    res.send(result);
})

module.exports = router

