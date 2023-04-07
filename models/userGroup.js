const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const userGroups = sequelize.define('userGroups', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    groupId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    admin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
})

module.exports = userGroups;