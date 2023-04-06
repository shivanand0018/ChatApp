const express = require('express')
const router = express.Router();
const path = require('path')
const signUpController = require('../controllers/signUp')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'signup.html'))
})

router.post('/addUser', signUpController.addUser)

module.exports = router