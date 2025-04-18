const {dbInstance} = require("../services/database");
const auth = require("../middleware/auth");
const { ObjectId } = require("mongodb");

class userController {
    constructor() {
    }

    async insertUsersBulkData(collectionName, n, indexField="", order=1) {
        try {
            const cnt = await dbInstance.db.collection(collectionName).countDocuments();
    
            if (cnt > 0)
                return {success:true, message:`Collection ${collectionName} already exist in DB.`};
        
            await dbInstance.createCollection(collectionName);
        
            if (indexField != "") {
                await dbInstance.createIndex(collectionName, indexField, order);
            }

            const roles = ["Student", "Teacher"];
        
            let bulkData = [];
        
            for (let i=1; i<=n; i++) {
                const role = roles[Math.floor(Math.random() * roles.length)];
                const name = `${role}${i}`;
                const email = `${role}${i}@realtimecollege.com`;

                let data = {
                    "name": name,
                    "email": email,
                    "role": role,
                    "password":btoa(`password${i}`)
                };

                bulkData.push(data);
            }

            await dbInstance.db.collection(collectionName).insertMany(bulkData);

            console.log(`Insert data into collection ${collectionName} complete.`);

            return  {success:true, message:`Collection ${collectionName} was created and filled with data.`};
        }
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async addAdminUser() {
        try {
            const user = await dbInstance.db.collection("users").findOne({email:"admin@admin.com"});

            let msg = "";
            if (!user) {
                let data = {
                    "name": "admin",
                    "email": "admin@admin.com",
                    "role": "Admin",
                    "password":btoa("admin")
                };

                await dbInstance.db.collection("users").insertOne(data);

                msg = "Admin user was created";
            }
            else {
                msg = "User admin already exist in DB";
            }

            return {success:true, message:msg};
        }
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;

            const user = await dbInstance.db.collection("users").findOne({email});
        
            if (!user)
                res.status(500).json({success:false, message:"The email you entered is incorrect."});
            else {
                const decryptedPassword = atob(user.password);
                if (decryptedPassword == password)
                    res.status(200).json({success:true, token:auth.authGenerateAccessToken(user)});
                else
                    res.status(500).json({success:false, message:"The username or password you entered is incorrect."});
            }
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async register(req, res) {
        try {
            const data = req.body;

            const {email} = data;

            if (!email)
                res.status(500).json({success:false, message:"User email is required."});

            const emailExist = await dbInstance.db.collection("users").findOne({email});
            if (emailExist) {
                res.status(500).json({success:false, message:"This email is already associated with an account."});
                return;
            }

            const {name} = data;
            const nameExist = await dbInstance.db.collection("users").findOne({name});
            if (nameExist) {
                res.status(500).json({success:false, message:"This user name is already associated with an account."});
                return;
            }

            data.password = btoa(data.password);
            data.role = "Student";  // default

            if (data.email.toLowerCase().indexOf("teacher") > -1)
                data.role = "Teacher";

            if (data.email.toLowerCase().indexOf("manager") > -1)
                data.role = "Manager";

            const token = await dbInstance.db.collection("users").insertOne(data);
    
            res.status(200).json({success:true, user:data});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getUsers(req, res) {
        const page = req.query.page || 1;
        const rows = req.query.rows || 50;
        const {role} = req.params || '';

        try {
            const query = (['all', ''].includes(role.toLowerCase())) ? {} : {role:role};
            const firstDocument = (page-1) * rows;
            const data = await dbInstance.db.collection("users").find(query).skip(firstDocument).limit(parseInt(rows)).toArray();
        
            res.status(200).json({success:true, users:data});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getUser(req, res) {
        try {
            const id = req.params.id;
            const user_id = new ObjectId(id);
            const user = await dbInstance.db.collection("users").findOne({_id:user_id});
        
            if (user)
                res.status(200).json({success:true, user:user});
            else
                res.status(500).json({success:false, message:"User not found."});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async updateUser(req, res) {
        try {
            const data = req.body;
            
            if (data.password)
                data.password = btoa(data.password);

            const {_id} = data;
            delete data._id;

            let user_id = new ObjectId(_id);
            await dbInstance.db.collection("users").updateOne(
                {_id:user_id},
                {$set:data}
            );

            res.status(200).json({success:true});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async removeUser(req, res) {
        try {
            const id = req.params.id;
            let user_id = new ObjectId(id);
            
            await dbInstance.db.collection("users").deleteOne(
                {_id:user_id},
            );

            res.status(200).json({success:true});
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new userController();
