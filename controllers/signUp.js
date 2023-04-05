const signUp = require('../models/signup')
const bcrypt = require('bcrypt')
const sequelize = require('../util/database');
const { Error } = require('sequelize');

exports.addUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userName = req.body.name;
        const email = req.body.email;
        const phoneNo = req.body.phone;
        const password = req.body.password;
        const resp = await signUp.findOne({ where: { email: email } })
        if (resp==null) {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    console.log(err);
                }
                const data = await signUp.create({
                    name: userName,
                    email: email,
                    phoneNo:phoneNo,
                    password: hash
                }, { transaction: t })
                await t.commit();
                res.json({ data: data })
            })
        }
        else{
            throw Error;
        }

    }
    catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ message: false, data: "Email already exists" })
    }
}