const { DataTypes } = require('sequelize');
const seqClient = require('../services/sequelizeClient');
const Student = require('./Student');
const LectureSession = require('./lecture_session');

if (!seqClient)
    return;

const StudentLecture = seqClient.define(
    'StudentLecture',
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Student,         // Reference to the Student model
          key: 'id',           // Foreign key points to Student.id
        },        
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: LectureSession, // Reference to the Lecture session model
          key: 'id',           // Foreign key points to Lecture.id
        },        
      },
    },
    {
      // Other model options go here
    },
);

module.exports = StudentLecture;
