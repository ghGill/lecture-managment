const axios = require('axios');
const {redis} = require("../services/redis");

class Axios {
    constructor() {
        this.openLibraryUrl = "https://openlibrary.org/api/books"
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
            const test = await this.search('');

            this.enableService();

            return {success:true, message:'Axios is ready'};
        } 
        catch (e) {
            return {success:false, message:'Axios is not ready'};
        }
    }

    async search(keys) {
        try {
            let output = {};
            let notInCacheKeys = [];

            // ISBN:9781408113479,OCLC:420517,ISBN:9780553418811,ISBN:9781408815762,ISBN:0669394823
            const keys_arr = keys.split(',')

            for (const key of keys_arr) {
                const keyExist = await redis.exist(key);
                if (keyExist) {
                    output[key] = JSON.parse(await redis.get(key));
                }
                else {
                    notInCacheKeys.push(key);
                }
            }

            let searchKeys = '';
            if (notInCacheKeys.length > 0)
                searchKeys = notInCacheKeys.join(',');

            if (notInCacheKeys.length > 0) {
                const result = await axios.get(this.openLibraryUrl + `?bibkeys=${searchKeys}&format=json&jscmd=viewapi`);
            
                for (const [key, value] of Object.entries(result.data)) {
                    output[key] = value;
                    await redis.put(key, JSON.stringify(value), {EX:30});
                }
            }

            return {success:true, data:output};
        }
        catch (e) {
            return {success:false, message:e.message};
        }
    }
}

module.exports = { axios: new Axios() };


// https://axios-http.com/docs/api_intro
// https://openlibrary.org/swagger/docs#/books/read_api_books_api_books_get
