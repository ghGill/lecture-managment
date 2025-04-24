const redis = require('redis');
const config = require("config");

class Redis {
    constructor() {
        this.client = null;
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

    async connect(flush=false) {
        try {
            const redisHost = process.env.REDIS_HOST || config.get("redis.host");
            const redisUri = `redis://${redisHost}:${config.get("redis.port")}`;

            this.client = redis.createClient({
                url: redisUri
            });

            // this.client.on('error', (err) => {
            //     console.error('Redis Error:', err);
            // });

            await this.client.connect();

            if (flush)
                await this.clear();
            
            this.enableService();

            return {success:true, message:'Redis connected successfully'};
        } 
        catch (e) {
            return {success:false, message:'Redis connected failed '};
        }
    }

    // keys : string | array
    // return the number of keys that exists in cache
    async exist(keys) {
        if (!this.isEnable())
            return false;

        try {
            const result = await this.client.exists(keys);

            return result;
        }
        catch (error) {
            throw error;
        }
    }

    // keys : array
    // return if all keys exists in cache
    async allExist(keys) {
        if (!this.isEnable())
            return false;
        
        try {
            const result = await this.exist(keys)
        
            return (result == keys.length);
        }
        catch (error) {
            throw error;
        }
    }

    async put(key, val) {
        if (!this.isEnable())
            return false;
        
        try {
            this.client.set(key, val);
            console.log(`Key ${key} was added to cache.`);

            return true;
        }
        catch (error) {
            throw error;
        }
    }

    async get(key) {
        if (!this.isEnable())
            return false;
        
        try {
            console.log(`Key ${key} was readed from cache.`)

            return this.client.get(key);
        }
        catch (error) {
            throw error;
        }
    }

    // keys : string | array
    async clear(keys=null) {
        if (!this.isEnable())
            return false;
        
        try {
            if (!keys) {
                await this.client.flushAll();
                console.log('Redis cache was cleared');
            }
            else {
                await this.client.del(keys);
                console.log(`Keys ${keys} remomved from cache`);
            }

            return true;
        }
        catch (error) {
            throw error;
        }
    }

    async getAllKeys() {
        if (!this.isEnable())
            return [];
        
        try {
            const data = await this.client.keys('*');

            return data;
        }
        catch (error) {
            throw error;
        }
    }

    async disconnect() {
        if (!this.isEnable())
            return false;
        
        try {
            this.client.quit();
            console.log('Redis was diconnected successfully');

            return true;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = { redis: new Redis() };
