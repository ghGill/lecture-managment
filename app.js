const express = require("express");
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const lectureRouter = require("./routes/lecture");
const userRouter = require("./routes/user");
const {db} = require("./database");
const dotenv = require('dotenv');

const app = express()
app.use(express.json())

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/lecture', lectureRouter)
app.use('/user', userRouter)

app.get('/_/health_check', async (req, res) => {
    res.status(200).json("healthy")
})

async function createCollectionWithData(collectionName, bulkInsertFunction, qty, indexField="", order=1) {
    await db.createCollection(collectionName);

    if (indexField != "") {
        await db.createIndex(collectionName, indexField, order);
    }

    await db[bulkInsertFunction](collectionName, qty);
}

async function runUnitTest() {
    await db.removeCollection("lectures");

    await createCollectionWithData("lectures", "insertLecturesBulkData", 2000);

    let t1 = Date.now();
    await db.fetchAllDocuments("lectures");
    let t2 = Date.now();
    console.log(`Fetch data without index took ... ${t2 - t1}ms.`);

    // create collection with index
    await db.createIndex("lectures", "subject", 1);

    t1 = Date.now();
    await db.fetchAllDocuments("lectures");
    t2 = Date.now();
    console.log(`Fetch data with index took ... ${t2 - t1}ms.`);

    // delete index
    await db.removeIndex("lectures", "subject_1");
}

dotenv.config();
const {PORT} = process.env;

app.listen(PORT, async () => {
    try {
        console.log(`running on port ${PORT}`);
        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    
        await db.connect();
        await db.createDatabase("lecturesDB");

        await createCollectionWithData("lectures", "insertLecturesBulkData", 2000);
        await createCollectionWithData("users", "insertUsersBulkData", 2000);

        // await runUnitTest();
    }
    catch(e) {
        console.log(e);
    }
})
