const message = require('../models/message');
const User = require("../models/signup");
const sequelize = require('../util/database');

exports.postMsg = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const resp = await message.create({
            text: req.body.text,
            userId: req.user.id
        })
        await t.commit();
        res.json({ data: resp })
    }
    catch (err) {
        await t.rollback()
    }
}

exports.getMsg = async (req, res) => {
    try {
        const resp = await message.findAll()
        const user = await User.findAll();
        console.log(res);
        res.json({ data: resp ,users:user,loggedUser:req.user})
    }
    catch (err) {
        console.log(err);
    }
}