const express = require("express");

const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

const lectureRouter = require("./routes/lecture");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const redisRouter = require("./routes/redis");

const {dbInstance} = require("./services/database");
const {redis} = require("./services/redis");

const dotenv = require('dotenv');
dotenv.config();

const config = require('config');

const userController = require("./controllers/user");
const lectureController = require("./controllers/lecture");

const app = express()
app.use(express.json())

// Swagger UI setup
const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

app.use('/lecture', lectureRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/redis', redisRouter)

async function allServicesAreRunning() {
    try {
        // Check MongoDB connection
        if (!dbInstance.client) {
            return "MongoDB is not connected";
        }

        // Check Redis connection
        if (!redis.isEnable()) {
            return "Redis is not connected";
        }

        return true;
    } 
    catch (error) {
        return `Service check error: ${error.message}`;
    }
}

app.get('/_/health_check', async (req, res) => {
    try {
        const result = await allServicesAreRunning();
        
        if (result !== true) {
            return res.status(503).json({
                status: "unhealthy",
                message: result
            });
        }
        
        res.status(200).json({
            status: "healthy",
            message: "All services are running"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
})

async function runUnitTest() {
    await dbInstance.removeCollection("lectures");

    console.log(await lectureController.insertLecturesBulkData("lectures", 2000));

    let t1 = Date.now();
    await dbInstance.fetchAllDocuments("lectures");
    let t2 = Date.now();
    console.log(`Fetch data without index took ... ${t2 - t1} ms.`);

    // create collection with index
    await dbInstance.createIndex("lectures", "subject", 1);

    t1 = Date.now();
    await dbInstance.fetchAllDocuments("lectures");
    t2 = Date.now();
    console.log(`Fetch data with index took ... ${t2 - t1}ms.`);

    // delete index
    await dbInstance.removeIndex("lectures", "subject_1");
}

const appPort = config.get("app.port") || process.env.DEFAULT_APP_PORT;

app.listen(appPort, async () => {
    try {
        console.log(`running on port ${appPort}`);
        console.log(`Swagger documentation available at http://localhost:${appPort}/api-docs`);
    
        console.log(await redis.connect());
        console.log(await dbInstance.connect());

        const result = await allServicesAreRunning();
        if (result === true) {
            console.log(await dbInstance.createDatabase(config.get("db.name")));

            console.log(await lectureController.insertLecturesBulkData("lectures", 2000));
            console.log(await userController.insertUsersBulkData("users", 2000));
            console.log(await userController.addAdminUser());

            // await runUnitTest();
        }
        else {
            console.log(result);
        }
    }
    catch(e) {
        console.log(e);
    }
})
