const {dbInstance} = require("../services/database");
const auth = require("../middleware/auth");
const { ObjectId } = require("mongodb");
const {redis} = require("../services/redis");

class lectureController {
    constructor() {
    }

    async insertLecturesBulkData(collectionName, n, indexField="", order=1) {
        try {
            const cnt = await dbInstance.db.collection(collectionName).countDocuments();
    
            if (cnt > 0)
                return {success:true, message:`Collection ${collectionName} already exist in DB.`};
        
            await dbInstance.createCollection(collectionName);
        
            if (indexField != "") {
                await dbInstance.createIndex(collectionName, indexField, order);
            }

            const subjects = ["Math", "History", "Physics", "Geogrphy", "Literature"];
            const teachers = ["John", "Anry", "Linda", "Suzan", "Dilan"];
        
            let bulkData = [];
        
            subjects.forEach(subject => {
                for (let i=0; i<n; i++) {
                    let data = {
                        "subject":subject.toLowerCase(),
                        "duration":Math.floor(Math.random() * 3) + 1,
                        "teacher":teachers[Math.floor(Math.random() * teachers.length)],
                        "date": new Date(2025, Math.floor(Math.random() * 9) + 3, Math.floor(Math.random() * 30) + 1),
                        "room":`Room ${(i % 5) + 1}`
                    };
                    bulkData.push(data);
                }
            })
            await dbInstance.db.collection(collectionName).insertMany(bulkData);

            console.log(`Insert data into collection ${collectionName} complete.`);

            return {success:true, message:`Collection ${collectionName} was created and filled with data.`};
        }
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getLectures(req, res) {
        try {
            const subject = req.params.subject;
            const page = req.query.page || 1;
            const rows = req.query.rows || 50;

            const t1 = Date.now();

            if (await redis.exist(subject)) {
                console.log("Fetch data from REDIS")
                res.status(200).json({success:true, lectures:JSON.parse(await redis.get(subject))})
            }
            else {
                console.log("Fetch data from DB")
 
                const firstDocument = (page - 1) * rows;

                const data = await dbInstance.db.collection("lectures").find({subject:subject}).skip(firstDocument).limit(parseInt(rows)).toArray();
            
                await redis.put(subject, JSON.stringify(data));

                res.status(200).json({success:true, lectures:data})
            }

            const t2 = Date.now();
            
            console.log(`Fetch data took ${t2 - t1} ms.`);
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async addLecture(req, res) {
        try {
            const data = req.body;

            const result = await dbInstance.db.collection("lectures").insertOne(data);
        
            res.status(200).json({success:true, lecture:data})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async updateLecture(req, res) {
        try {
            const data = req.body;

            const {_id} = data;
            delete data._id;

            let doc_id = new ObjectId(_id);
            await dbInstance.db.collection("lectures").updateOne(
                {_id:doc_id},
                {$set:data}
            );

            res.status(200).json({success:true})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async removeLecture(req, res) {
        try {
            const id = req.params.id;
            let doc_id = new ObjectId(id);

            await dbInstance.db.collection("lectures").deleteOne(
                {_id:doc_id},
            );

            res.status(200).json({success:true})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new lectureController();
