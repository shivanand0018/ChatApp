const login = require('../models/signup')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.checkUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let data = await login.findAll({ where: { email: email } })
        if (data.length > 0) {
            bcrypt.compare(password, data[0].password, (err, result) => {
                if (result === true) {
                    res.status(200).json({ message: true, data: "Logged in successfully...", token: generateJsonToken(data[0].id) })
                }
                else {
                    res.status(400).json({ message: false, data: "Password Incorrect" })
                }
            })
        }
        else {
            res.status(404).json({ message: false, data: "User doesn't Exist" })
        }
    }
    catch (err) {
        console.log(err);
    }
}

function generateJsonToken(id, PremiumUser) {
    return jwt.sign({ userid: id }, 'shivanand')
}


