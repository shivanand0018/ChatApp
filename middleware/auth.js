const jwt = require('jsonwebtoken')
const User = require('../models/signup')

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'shivanand');
        const data = await User.findByPk(user.userid)
        req.user = data
        next();
    }
    catch (err) {
        console.log(err);
    }
}