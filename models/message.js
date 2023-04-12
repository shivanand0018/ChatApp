const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Message = sequelize.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: Sequelize.STRING,
    },
    imageUrl:{
        type:Sequelize.STRING
    }
})

module.exports = Message;