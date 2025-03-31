const { MongoClient, ObjectId } = require("mongodb");

class Database {
    constructor() {
    }

    async connect() {
        return new Promise(async (resolve, reject) => {
            try {
                const {MONGODB_URI} = process.env;
                this.client = new MongoClient(MONGODB_URI);
                await this.client.connect();
    
                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async createDatabase(dbName) {
        return new Promise(async (resolve, reject) => {
            try {
                this.db = this.client.db(dbName);
    
                console.log(`Database ${dbName} was created.`);

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async removeDatabase() {
        return new Promise(async (resolve, reject) => {
            try {
                this.db.dropDatabase();
    
                console.log(`Database was removed.`);

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async createCollection(collectionName) {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = this.db.createCollection(collectionName);
    
                console.log(`Collection ${collectionName} was created.`);

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async removeCollection(collectionName) {
        return new Promise(async (resolve, reject) => {
            try {
                this.db.dropCollection(collectionName);
    
                console.log(`Collection ${collectionName} was removed.`);

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async createIndex(collectionName, indexField, order=1) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = {};
                query[indexField] = order;
                this.db.collection(collectionName).createIndex(query);
    
                console.log(`Index ${indexField} for collection ${collectionName} was created.`);

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async removeIndex(collectionName, indexField) {
        return new Promise(async (resolve, reject) => {
            try {
                this.db.collection(collectionName).dropIndex(indexField);
    
                console.log(`Index ${indexField} for collection ${collectionName} was removed.`);

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async fetchAllDocuments(collectionName) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = this.db.collection(collectionName).find({}).toArray();

                resolve(result);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    // ************* LECTURES ****************************

    async insertLecturesBulkData(collctionName, n) {
        return new Promise(async (resolve, reject) => {
            try {
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
                await this.db.collection(collctionName).insertMany(bulkData);

                console.log(`Insert data into collection ${collctionName} complete.`);

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async getLectures(subject, page=1, rows=50) {
        return new Promise(async (resolve, reject) => {
            try {
                const firstDocument = (page-1) * rows;
                const data = await this.db.collection("lectures").find({subject:subject}).skip(firstDocument).limit(parseInt(rows)).toArray();
            
                resolve(data);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async addLecture(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.collection("lectures").insertOne(data);
            
                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async updateLecture(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const {_id} = data;
                delete data._id;

                let doc_id = new ObjectId(_id);
                await this.db.collection("lectures").updateOne(
                    {_id:doc_id},
                    {$set:data}
                );

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async removeLecture(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let doc_id = new ObjectId(id);
                await this.db.collection("lectures").deleteOne(
                    {_id:doc_id},
                );

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    // ************* USERS ****************************

    async getUsers(page=1, rows=50) {
        return new Promise(async (resolve, reject) => {
            try {
                const firstDocument = (page-1) * rows;
                const data = await this.db.collection("users").find({}).skip(firstDocument).limit(parseInt(rows)).toArray();
            
                resolve(data);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async insertUsersBulkData(collctionName, n) {
        return new Promise(async (resolve, reject) => {
            try {
                const roles = ["Admin", "Developer", "QA"];
            
                let bulkData = [];
            
                for (let i=0; i<n; i++) {
                    let data = {
                        "name": `User${i}`,
                        "email": `user${i}@gmail.com`,
                        "age": Math.floor(Math.random() * 30) + 20,
                        "role": roles[Math.floor(Math.random() * roles.length)]
                    };

                    bulkData.push(data);
                }

                await this.db.collection(collctionName).insertMany(bulkData);

                console.log(`Insert data into collection ${collctionName} complete.`);

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async getUser(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let user_id = new ObjectId(id);
                const data = await this.db.collection("users").find({_id:user_id}).toArray();
            
                resolve(data);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async addUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.collection("users").insertOne(data);
            
                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async updateUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const {_id} = data;
                delete data._id;

                let user_id = new ObjectId(_id);
                await this.db.collection("users").updateOne(
                    {_id:user_id},
                    {$set:data}
                );

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async removeUser(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let user_id = new ObjectId(id);
                await this.db.collection("users").deleteOne(
                    {_id:user_id},
                );

                resolve(true);
            }
            catch (e) {
                reject(e);
            }
        })
    }
}

module.exports = {db:new Database()}
