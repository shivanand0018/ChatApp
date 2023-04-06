const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING
    },
})

module.exports = Users;