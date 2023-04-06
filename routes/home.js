const express = require('express')
const router = express.Router();
const path = require('path')
const controller = require('../controllers/home')
const userAuth = require('../middleware/auth')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'home.html'))
})

router.post('/sendMsg', userAuth.authenticate, controller.postMsg)

router.get('/getMsg/:groupId/:id', userAuth.authenticate, controller.getMsg)

router.post('/createGroup',userAuth.authenticate, controller.createGroup)

router.post('/addToGroup',userAuth.authenticate, controller.addToGroup)

router.get('/getGroups',userAuth.authenticate, controller.getGroups)

router.get('/getMembers',userAuth.authenticate, controller.getMembers)

module.exports = router