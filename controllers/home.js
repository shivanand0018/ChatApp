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
    catch(err)
    {
        await t.rollback()
    }
}

exports.getMsg = async (req, res) => {
    const t = await sequelize.transaction();
    try{
    const resp = await message.findAll({ where: { userId: req.user.id } })
    t.commit();
    res.status(200).json({ data: resp })
    }
    catch(err)
    {
        t.rollback()
    }
}