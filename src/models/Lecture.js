const { DataTypes } = require('sequelize');
const seqClient = require('../services/sequelizeClient');

if (!seqClient)
    return;

const Lecture = seqClient.define(
    'Lecture',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
    },
);

module.exports = Lecture;
