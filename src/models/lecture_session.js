const { DataTypes } = require('sequelize');
const seqClient = require('../services/sequelizeClient');
const Lecture = require('./Lecture');

if (!seqClient)
    return;

const LectureSession = seqClient.define(
    'LectureSession',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
      lecture_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Lecture,         // Reference to the Lecture model
          key: 'id',           // Foreign key points to Lecture.id
        },
      },
      session_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      // Other model options go here
    },
);

module.exports = LectureSession;
