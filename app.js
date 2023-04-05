const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express();
const bodyparser = require('body-parser')
const sequelize = require('./util/database')

app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

const loginRoutes = require('./routes/login')
const signupRoutes = require('./routes/signup')


app.use('/signup', signupRoutes)

sequelize.sync().then(() => {
    app.listen(3000)
})