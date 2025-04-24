const { MongoClient, ObjectId } = require("mongodb");
const config = require("config");

class Database {
    constructor() {
        this.client = null;
        this.db = null;

        this.disableService();
    }

    enableService() {
        this.enabled = true;
    }

    disableService() {
        this.enabled = false;
    }

    isEnable() {
        return this.enabled;
    }

    async connect() {
        try {
            const dbHost = process.env.MONGO_HOST || config.get("db.host");
            const dbUri = `mongodb://${dbHost}:${config.get("db.port")}`;
            this.client = new MongoClient(dbUri);
            await this.client.connect();

            this.enableService();

            return {success:true, message:"Database connected successfully"}
        }
        catch (e) {
            return {success:false, message:e.message}
        }
    }

    async createDatabase(dbName) {
        if (!this.isEnable())
            return {success:false, message:'Database is not connected.'};

        try {
            this.db = this.client.db(dbName);

            return {success:true, message:`Database ${dbName} was created.`}
        }
        catch (e) {
            return {success:false, message:e.message}
        }
    }

    async removeDatabase() {
        if (!this.isEnable())
            return {success:false, message:'Database is not connected.'};

        try {
            this.db.dropDatabase();

            console.log(`Database was removed.`);

            return {success:true}
        }
        catch (e) {
            return {success:false, message:e.message}
        }
    }

    async createCollection(collectionName) {
        if (!this.isEnable())
            return {success:false, message:'Database is not connected.'};

        try {
            const collection = this.db.createCollection(collectionName);

            console.log(`Collection ${collectionName} was created.`);

            return {success:true}
        }
        catch (e) {
            return {success:false, message:e.message}
        }
    }

    async removeCollection(collectionName) {
        if (!this.isEnable())
            return {success:false, message:'Database is not connected.'};

        try {
            this.db.dropCollection(collectionName);

            console.log(`Collection ${collectionName} was removed.`);

            return {success:true}
        }
        catch (e) {
            return {success:false, message:e.message}
        }
    }

    async createIndex(collectionName, indexField, order=1) {
        if (!this.isEnable())
            return {success:false, message:'Database is not connected.'};

        try {
            let query = {};
            query[indexField] = order;
            this.db.collection(collectionName).createIndex(query);

            console.log(`Index ${indexField} for collection ${collectionName} was created.`);

            return {success:true}
        }
        catch (e) {
            return {success:false, message:e.message}
        }
    }

    async removeIndex(collectionName, indexField) {
        if (!this.isEnable())
            return {success:false, message:'Database is not connected.'};

        try {
            this.db.collection(collectionName).dropIndex(indexField);

            console.log(`Index ${indexField} for collection ${collectionName} was removed.`);

            return {success:true}
        }
        catch (e) {
            return {success:false, message:e.message}
        }
    }

    async fetchAllDocuments(collectionName) {
        if (!this.isEnable())
            return {success:false, message:'Database is not connected.'};

        try {
            const result = this.db.collection(collectionName).find({}).toArray();

            return {success:true, data:result}
        }
        catch (e) {
            return {success:false, message:e.message}
        }
    }
}

module.exports = {dbInstance:new Database()}
