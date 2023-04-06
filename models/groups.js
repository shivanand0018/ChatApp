const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const groups = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    groupName: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = groups;