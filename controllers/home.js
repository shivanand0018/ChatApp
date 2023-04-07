const message = require('../models/message');
const User = require("../models/signup");
const Group = require("../models/groups")
const userGroup = require("../models/userGroup")
const sequelize = require('../util/database');
const { Op } = require("sequelize");

exports.postMsg = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const resp = await message.create({
            text: req.body.text,
            userId: req.user.id,
            groupId: req.body.groupId
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
        let id = req.params.id
        const resp = await message.findAll({ where: { id: { [Op.gt]: id }, groupId: req.params.groupId } })
        const user = await User.findAll();
        res.json({ data: resp, users: user, loggedUser: req.user })
    }
    catch (err) {
        console.log(err);
    }
}

exports.createGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const data = await Group.create({
            groupName: req.body.groupname,
        })
        const data1 = await userGroup.create({
            userId: req.user.id,
            groupId: data.id,
            admin: req.body.admin
        })
        await t.commit()
        res.json({ data: data, data1: data1 })
    }
    catch (err) {
        await t.rollback()
        console.log(err);
    }
}

exports.getGroups = async (req, res) => {
    try {
        const groups = await User.findAll({
            where: { id: req.user.id }, include: [{
                model: Group
            }]
        })
        res.json({ data: groups })
    }
    catch (err) {
        console.log(err);
    }
}

exports.getMembers = async (req, res) => {
    try {
        const data = await User.findAll({
            where: { id: { [Op.ne]: req.user.id } }, include: [{
                model: Group
            }]
        })
        res.json({ data: data })
    }
    catch (err) {
        console.log(err);
    }
}

exports.addToGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const data = await userGroup.create({ userId: req.body.userId, groupId: req.body.groupId, admin: req.body.admin })
        t.commit()
        res.json({ data: data })
    }
    catch (err) {
        console.log(err);
        t.rollback()
        return res.status(404).json();
    }
}

exports.getMember = async (req, res) => {
    try {
        const data = await Group.findAll({
            where: { id: req.params.id }, include: [{
                model: User,
                where: { id: { [Op.ne]: req.user.id } }
            }]
        })
        console.log(data);
        res.json({ data: data })
    }
    catch (err) {
        console.log(err);
    }
}

exports.removeFromGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const data = await userGroup.destroy({ where: { groupId: req.params.groupId, userId: req.params.id } })
        await t.commit()
        res.json({ data: data })
    }
    catch (err) {
        t.rollback();
    }
}