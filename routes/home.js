const express = require('express')
const router = express.Router();
const path = require('path')
const controller = require('../controllers/home')
const userAuth = require('../middleware/auth')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'home.html'))
})

router.post('/sendMsg', userAuth.authenticate, controller.postMsg)

router.get('/getMsg/:id', userAuth.authenticate, controller.getMsg)

module.exports = router