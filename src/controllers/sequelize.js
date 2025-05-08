const { seqPG } = require("../services/sequelize");

class sequelizeController {
    constructor() {
    }

    async get(req, res) {
        try {
            const { model, id } = req.params;

            const result = await seqPG.get(model, id);
        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async insert(req, res) {
        try {
            const { model } = req.params;

            const result = await seqPG.insert(model, req.body);
                
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async update(req, res) {
        try {
            const { model } = req.params;

            const result = await seqPG.update(model, req.body);
                        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async delete(req, res) {
        try {
            const { id, model } = req.params;

            const result = await seqPG.delete(model, id);
                                
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getSession(req, res) {
        try {
            const { lectureId } = req.params;

            const result = await seqPG.getSession(lectureId);
                                        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async addSession(req, res) {
        try {
            const { lectureId, time, capacity } = req.params;

            const result = await seqPG.addSession(lectureId, time, capacity);
                                                
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async updateSession(req, res) {
        try {
            const result = await seqPG.updateSession(req.body);
                                                
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async deleteSession(req, res) {
        try {
            const { id, lectureId } = req.params;

            const result = await seqPG.deleteSession(id, lectureId);
                                                        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async registerStudent(req, res) {
        try {
            const { sessionId, studentId } = req.params;

            const result = await seqPG.registerStudent(studentId, sessionId);
                                                                
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async unRegisterStudent(req, res) {
        try {
            const { studentId, sessionId } = req.params;

            const result = await seqPG.unRegisterStudent(studentId, sessionId);
                                                                        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getStudentLectures(req, res) {
        try {
            const { studentId } = req.params;

            const result = await seqPG.getStudentLectures(studentId);
                                                                                
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getSessionStudents(req, res) {
        try {
            const { sessionId } = req.params;

            const result = await seqPG.getSessionStudents(sessionId);
                                                                                        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getSessionsInfo(req, res) {
        try {
            const result = await seqPG.getSessionsInfo();
                                                                                        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getStudentsInfo(req, res) {
        try {
            const result = await seqPG.getStudentsInfo();
                                                                                        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async getFullSessions(req, res) {
        try {
            const result = await seqPG.getFullSessions();
                                                                                        
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }

    async searchSessions(req, res) {
        try {
            const { fieldName, text } = req.params;

            const result = await seqPG.searchSessions(fieldName, text);
                                                                                                
            res.status(200).json({success:true, data:result})
        }
        catch (e) {
            res.status(500).json({success:false, message:e.message});
        }
    }
}

module.exports = new sequelizeController();
