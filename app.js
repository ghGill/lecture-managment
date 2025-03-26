const express = require("express");
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const { APP_PORT } = require("./app-config");
const lectureRouter = require("./routes/lecture");
const {db} = require("./database");

const app = express()
app.use(express.json())

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/lecture', lectureRouter)

async function createCollectionWithData(collectionName, qty, indexField="", order=1) {
    await db.createCollection(collectionName);

    if (indexField != "") {
        await db.createIndex(collectionName, indexField, order);
    }

    await db.insertLecturesBulkData(collectionName, qty);
}

async function getAllDocuments(collectionName) {
    let t1 = Date.now();

    const qq = await db.getAllDocuments(collectionName);
    console.log(qq.length);

    let t2 = Date.now();
    console.log(`Process time: ${(t2 - t1) / 1000}`);
}

app.listen(APP_PORT, async () => {
    console.log(`running on port ${APP_PORT}`);
    console.log(`Swagger documentation available at http://localhost:${APP_PORT}/api-docs`);

    try {
        await db.connect();
        await db.createDatabase("lecturesDB");
        // await createCollectionWithData("lectures", 2000);
        // await createCollectionWithData("lectures2", 2000, "subject");

        // await getAllDocuments("lectures");
        // await getAllDocuments("lectures2");
    }
    catch(e) {
        console.log(e);
    }
})
