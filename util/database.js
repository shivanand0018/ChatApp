const Sequelize = require('sequelize');

const sequelize = new Sequelize('chatApp','root','password@123', {
    dialect: 'mysql', host: 'localhost'
})

module.exports = sequelize;