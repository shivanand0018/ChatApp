const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express();

const bodyparser = require('body-parser')
const sequelize = require('./util/database')
const Message = require('./models/message')
const User = require('./models/signup')
const Group = require('./models/groups')
const userGroup = require('./models/userGroup')

const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
require('dotenv').config();

app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cors({
    origin: "*"
}))

app.use(express.static(path.join(__dirname, 'public')))

io.on("connection", socket => {
    console.log(socket.id);

    socket.on('generategroup', (room) => {
        console.log(room + "hi");
        socket.join(room)
    })

    socket.on("chatMessage", (msg, url, id, userId, loggedUserId, name) => {
        let obj = {
            msg: msg,
            url: url,
            id: id,
            userId: userId,
            loggedUserId: loggedUserId,
            name: name
        }
        io.emit("message", obj);
    });
})

const loginRoutes = require('./routes/login')
const signupRoutes = require('./routes/signup')
const homeRoutes = require('./routes/home');

app.use('/signup', signupRoutes)
app.use('/login', loginRoutes)
app.use('/home', homeRoutes)

User.hasMany(Message)
Message.belongsTo(User)

User.belongsToMany(Group, { through: userGroup })
Group.belongsToMany(User, { through: userGroup })

Group.hasMany(Message)
Message.belongsTo(Group)

sequelize.sync().then(() => {
    server.listen(3000)
})