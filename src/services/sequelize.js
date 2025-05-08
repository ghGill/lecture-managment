const { Op, fn, col, where, literal } = require('sequelize');
const seqClient = require('../services/sequelizeClient');
const Student = require("../models/Student");
const Lecture = require("../models/Lecture");
const StudentLecture = require("../models/student_lecture");
const LectureSession = require("../models/lecture_session");

class SequelizePG {
    constructor() {
        this.client = seqClient;

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

    async initializeAssociations() {
        // Initialize associations between models
        Student.hasMany(StudentLecture, {
            foreignKey: 'student_id',
            onDelete: 'CASCADE',
            as: 'sl'
        });

        Lecture.hasMany(LectureSession, {
            foreignKey: 'lecture_id',
            onDelete: 'CASCADE',
            as: 'ls'
        });

        LectureSession.hasMany(StudentLecture, {
            foreignKey: 'session_id',
            onDelete: 'CASCADE',
            as: 'sl'
        });

        StudentLecture.belongsTo(Student, {
            foreignKey: 'student_id',
            onDelete: 'CASCADE',
            as: 's'
        });

        StudentLecture.belongsTo(LectureSession, {
            foreignKey: 'session_id',
            onDelete: 'CASCADE',
            as: 'ls'
        });

        LectureSession.belongsTo(Lecture, {
            foreignKey: 'lecture_id',
            onDelete: 'CASCADE',
            as: 'l'
        });
    }

    async connect(flush=false) {
        try {
            if (!this.client)
                return {success:false, message:'Sequelize connected failed '};

            await this.createTables(false);
            // console.log(await this.test());

            this.enableService();

            return {success:true, message:'Sequelize connected successfully'};
        } 
        catch (e) {
            return {success:false, message:'Sequelize connected failed '};
        }
    }

    async createTables(recreateTables = false) {
        try {
            await this.client.authenticate();
            await this.initializeAssociations();
            await this.client.sync({force: recreateTables});  // create all tables from models

            if (recreateTables) {
                await this.insertData();
            }

            return {success:true, message:'All tables created successfully'};
        }
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async insertData() {
        console.log("Insert students records");
        let data = {};

        for (let i=1; i<=10; i++) {
            data = {
                "first_name": `Student${i}-fn`,
                "last_name": `Student${i}-ln`
            }
            await this.insert(Student, data);
        }

        console.log("Insert lectures records");
        for (let i=1; i<=10; i++) {
            data = {
                "name": `Lecture-${i}`,
            }
            await this.insert(Lecture, data);
        }

        console.log("Insert lectures sessions records");
        let total_sessions = 0;
        const session_hours = ['10:00', '14:00', '18:00'];
        for (let i=1; i<=10; i++) {
            const sessions = Math.floor(Math.random() * 3) + 1;
            total_sessions += sessions;

            for (let s=0; s<sessions; s++) {
                await this.addSession(i,  session_hours[s],  Math.floor(Math.random() * 10) + 5);
            }
        }

        console.log("Insert students lectures sessions records");
        let d = new Date();
        let registerData = [];
        for (let s=1; s<=3; s++) {
            let sessionId = 0;
            for (let i=1; i<=8; i++) {
                sessionId = Math.floor(Math.random() * total_sessions) + 1;
                let step = d.getTime() % 10000;
                let regSessionId = (sessionId + step) % total_sessions;
                registerData.push({studentId:i, sessionId:regSessionId});
            }
        }

        registerData.forEach(async (data) => {
            await this.registerStudent(data.studentId, data.sessionId);
        })
    }

    async recordExist(model, id) {
        try {
            const result = await model.findOne(
                { where: {id: id} },
            );

            return result;
        } 
        catch (e) {
            return false;
        }
    }

    async insert(model=null, data={}) {
        try {
            if (!model)
                return {success:false, message:'Model parameter is missing'};

            if (typeof model == 'string') {
                if (!this.client.models[model])
                    return {success:false, message:`Model ${model} not found`};

                model = this.client.models[model];
            }

            const result = await model.create(data);
            
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async update(model=null, data={}) {
        try {
            if (!model)
                return {success:false, message:'Model parameter is missing'};

            if (typeof model == 'string') {
                if (!this.client.models[model])
                    return {success:false, message:`Model ${model} not found`};

                model = this.client.models[model];
            }

            if (!data.id)
                return {success:false, message:'id key is missing'};

            const result = await model.update(
                data, 
                {
                    where: {id: data.id},
                },
            );
            
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async delete(model=null, id=null) {
        try {
            if (!model)
                return {success:false, message:'Model parameter is missing'};

            if (typeof model == 'string') {
                if (!this.client.models[model])
                    return {success:false, message:`Model ${model} not found`};

                model = this.client.models[model];
            }

            if (!id)
                return {success:false, message:`id key is missing`};

            const result = await model.destroy(
                {
                    where: {id: id},
                },
            );
            
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async get(model=null, id=null) {
        try {
            if (!model)
                return {success:false, message:'Model parameter is missing'};

            if (typeof model == 'string') {
                if (!this.client.models[model])
                    return {success:false, message:`Model ${model} not found`};

                model = this.client.models[model];
            }

            let filter = {raw: true};
            if (parseInt(id))
                filter = {
                            where: {
                                id: id
                            },
                            raw: true,
                        };

            const result = await model.findAll(
                filter,
            );

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getSession(lectureId=null) {
        try {
            const exist = await this.recordExist(Lecture, lectureId);
            if (!exist)
                return {success:false, message:`Lecture id ${lectureId} not exist`};

            let filter = {
                raw: true,
                order: [['session_time', 'ASC']]
            };

            if (parseInt(lectureId))
                filter.where = {
                                   lecture_id: lectureId
                               };

            const result = await LectureSession.findAll(
                filter,
            );

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async addSession(lectureId, sessionTime, capacity) {
        try {
            const exist = await this.recordExist(Lecture, lectureId);
            if (!exist)
                return {success:false, message:`Lecture id ${lectureId} not exist`};

            const result = await LectureSession.create(
                {
                    lecture_id:lectureId, 
                    session_time:sessionTime,
                    capacity: capacity
                },
            );
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async updateSession(data={}) {
        try {
            if (!data.id)
                return {success:false, message:'Session id key is missing'};

            const result = await LectureSession.update(
                data, 
                {
                    where: {
                        id: data.id
                    },
                },
            );
            
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async deleteSession(id=null, lectureId=null) {
        try {
            let filter = {};
            if (parseInt(lectureId)) {
                filter = {
                    where: {
                        lecture_id: lectureId
                    }
                };
            }

            if (parseInt(id)) {
                filter = {
                    where: {
                        id: id
                    }
                };
            }

            const result = await LectureSession.destroy(
                filter,
            );
  
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async registerStudent(studentId, sessionId) {
        try {
            const studentExist = await this.recordExist(Student, studentId);
            if (!studentExist)
                return {success:false, message:`Student id ${studentId} not exist`};

            const sessionExist = await this.recordExist(LectureSession, sessionId);
            if (!sessionExist)
                return {success:false, message:`Lecture session id ${sessionId} not exist`};

            const studentSessionExist = await StudentLecture.findOne(
                {   
                    where: {
                        student_id: studentId,
                        session_id: sessionId
                    }
                },
            );

            if (studentSessionExist)
                return {success:false, message:`Student ${studentId} already registered for this lecture`};

            const registredStudents = await StudentLecture.findOne({
                attributes: [
                    [this.client.fn('COUNT', this.client.col('student_id')), 'students_count'],
                    [this.client.col('ls.capacity'), 'capacity'],
                ],
                include: [
                    {
                        model: LectureSession,
                        as: 'ls',
                        attributes: [],
                        where: {
                            id: sessionId
                        }
                    },
                ],
                group: [
                    'session_id',
                    "ls.capacity",
                    "ls.id"
                ],
                nest: true,
                raw: true,
            });

            if (registredStudents) {
                if (registredStudents.capacity == parseInt(registredStudents.students_count))
                    return {success:false, message:`Registration for session ${sessionId} is full`};
            }

            const result = await StudentLecture.create(
                {
                    student_id:studentId, 
                    session_id:sessionId, 
                },
                { 
                    raw: true,
                }
            );
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async unRegisterStudent(studentId, sessionId) {
        try {
            const studentExist = await this.recordExist(Student, studentId);
            if (!studentExist)
                return {success:false, message:`Student id ${studentId} not exist`};

            const studentSessionExist = await StudentLecture.findOne(
                { where: {
                    student_id: studentId},
                    session_id: sessionId
                },
            );

            if (!studentSessionExist)
                return {success:false, message:`Student id ${studentId} is not register to this session`};

            const result = await StudentLecture.destroy(
                {
                    where: {
                        student_id: studentId,
                        session_id: sessionId,
                    }
                },
                { raw: true }
            );
  
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getStudentLectures(studentId) {
        try {
            const studentExist = await this.recordExist(Student, studentId);
            if (!studentExist)
                return {success:false, message:`Student id ${studentId} not exist`};

            const result = await StudentLecture.findAll(
                {
                    attributes: [
                        'session_id',
                        [this.client.col('ls.session_time'), 'session_time'],
                        [this.client.col('ls.l.name'), 'lecture_name'],
                    ],
                    where: {
                        student_id: studentId,
                    },
                    include: [{
                        model: LectureSession,
                        as: 'ls',
                        attributes: [],
                        include: [{
                            model: Lecture,
                            as: 'l',
                            attributes: []
                        }]
                    }],
                    raw: true,
                    nest: true,
                }
            );

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getSessionStudents(sessionId) {
        try {
            const sessionExist = await this.recordExist(LectureSession, sessionId);
            if (!sessionExist)
                return {success:false, message:`Session id ${sessionId} not exist`};

            const result = await StudentLecture.findAll(
                {
                    attributes:[
                        [this.client.col('s.id'), 'student_id'],
                        [this.client.col('s.first_name'), 'first_name'],
                        [this.client.col('s.last_name'), 'last_name'],
                    ],
                    where: {
                        session_id: sessionId,
                    },
                    include: [{
                        model: Student,
                        as: 's',
                        attributes: [],
                    }],
                    raw: true,
                    nest: true,
                }
            );
  
            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getSessionsInfo() {
        try {
            const result = await Lecture.findAll({
                attributes: [
                    [this.client.col('ls.id'), 'session_id'],
                    ['name', 'lecture_name'],
                    [this.client.col('ls.session_time'), 'session_time'],
                    [this.client.col('ls.capacity'), 'capacity'],
                    [this.client.fn('COUNT', this.client.col('ls.sl.id')), 'students_count']
                ],
                include: [
                  {
                    model: LectureSession,
                    as: 'ls',
                    attributes: [],
                    required: true,
                    include: [
                      {
                        model: StudentLecture,
                        as: 'sl',
                        attributes: [],
                      }
                    ]
                  }
                ],
                group: [
                  'Lecture.id',
                  'ls.id'
                ],
                order: [['lecture_name', 'ASC'], ['session_time', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getStudentsInfo() {
        try {
            const result = await StudentLecture.findAll({
                attributes: [
                  [this.client.col('s.id'), 'student_id'],
                  [this.client.col('s.first_name'), 'first_name'],
                  [this.client.col('s.last_name'), 'last_name'],
                  [this.client.col('ls.l.name'), 'lecture_name'],
                  [this.client.col('ls.session_time'), 'session_time'],
                ],
                include: [
                  {
                    model: LectureSession,
                    as: 'ls',
                    attributes: [],
                    include: [
                      {
                        model: Lecture,
                        as: 'l',
                        attributes: [],
                      },
                    ]
                  },
                  {
                    model: Student,
                    as: 's',
                    attributes: [],
                  }
                ],
                order: [['first_name', 'ASC'], ['last_name', 'ASC'], ['session_time', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async getFullSessions() {
        try {
            const result = await LectureSession.findAll({
                attributes: [
                  ['id', 'session_id'],
                  'capacity',
                  'session_time',
                  [this.client.col('l.name'), 'lecture_name'],
                ],
                include: [
                  {
                    model: Lecture,
                    as: 'l',
                    attributes: [],
                    required: true,
                  },
                  {
                    model: StudentLecture,
                    as: 'sl',
                    attributes: [],
                    required: false,
                  },
                ],
                group: [
                    "LectureSession.id",
                    "l.name",
                    "l.id",
                ],
                having: this.client.literal('COUNT("sl"."student_id") >= "LectureSession"."capacity"'),
                order: [['lecture_name', 'ASC'], ['session_time', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }

    async searchSessions(fieldName, text) {
        try {
            const searchText = `%${text}%`;

            let whereObj = {};
            let fnVar = '';
            switch (fieldName) {
                case 'name':
                    whereObj = {
                        [fieldName] : { [Op.like]: searchText },
                    };
                    break;

                case 'date':
                    whereObj = where(
                        fn('TO_CHAR', col('Lecture.createdAt'), 'YYYY-MM-DD'),
                        { [Op.like]: searchText }
                      );
                    break;
            }

            const result = await Lecture.findAll({
                attributes: [
                    ['id', 'lecture_id'],
                    ['name', 'lecture_name'],
                    'createdAt',
                    [this.client.col('ls.id'), 'session_id'],
                    [this.client.col('ls.capacity'), 'capacity'],
                ],
                where: whereObj,
                include: [
                  {
                    model: LectureSession,
                    as: 'ls',
                    attributes: [],
                    required: true,
                  },
                ],
                order: [['name', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }
    
    async test() {
        try {
            const result = await Student.findAll({
                attributes: [
                    ['id', 'student_id'],
                    'first_name',
                    'last_name',
                    [this.client.col('sl.ls.l.id'), 'lecture_id'],
                    [this.client.col('sl.ls.l.name'), 'lecture_name'],
                    [this.client.fn('COUNT', this.client.col('sl.id')), 'sessions_count']
                ],
                include: [
                  {
                    model: StudentLecture,
                    as: 'sl',
                    attributes: [],
                    required: true,
                    include:[
                        {
                            model: LectureSession,
                            as: 'ls',
                            attributes:[],
                            required: true,
                            as: 'ls',
                            include:[
                                {
                                    model: Lecture,
                                    as: 'l',
                                    attributes:[],
                                    required: true,
                                },
                            ],
                        },
                    ],
                  },
                ],
                group: ['Student.id', 'sl.ls.l.id'],
                order: [['sessions_count', 'ASC']],
                nest: true,
                raw: true,
            });

            return {success:true, data:result};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }
    
}

module.exports = { seqPG: new SequelizePG() };
