const {axios} = require("../services/axios");

class axiosController {
    constructor() {
    }

    async search(req, res) {
        try {
            const keys = req.params.keys;

            const data = await axios.search(keys);

            res.status(200).json({success:true, data:data})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new axiosController();
