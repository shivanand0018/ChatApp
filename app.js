const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express();
const bodyparser = require('body-parser')
const sequelize = require('./util/database')
const Message = require('./models/message')
const User = require('./models/signup')
const Group=require('./models/groups')
const userGroup=require('./models/userGroup')

app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cors({
    origin: "*"
}))

app.use(express.static(path.join(__dirname, 'public')))

const loginRoutes = require('./routes/login')
const signupRoutes = require('./routes/signup')
const homeRoutes = require('./routes/home')

app.use('/signup', signupRoutes)
app.use('/login', loginRoutes)
app.use('/home', homeRoutes)

User.hasMany(Message)
Message.belongsTo(User)

User.belongsToMany(Group,{through:userGroup})
Group.belongsToMany(User,{through:userGroup})

Group.hasMany(Message)
Message.belongsTo(Group)

sequelize.sync().then(() => {
    app.listen(3000)
})