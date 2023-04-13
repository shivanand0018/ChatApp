let socket = io()
const table = document.getElementById('div');
const text = document.getElementById('text')
const file = document.getElementById('uploadFileInput')
const token = localStorage.getItem('token')
var groupId;


socket.emit("generategroup", 'room');

async function postText(e) {
    e.preventDefault();
    try {
        let obj = {
            text: text.value,
            groupId: groupId,
            file: file.value
        }
        let text1 = text.value
        if (file.value == "") {
            let data = await axios.post('http://54.160.107.218:3000/home/sendMsg', obj, { headers: { "Authorization": token } })
            socket.emit("chatMessage", text1, "", data.data.data.id, data.data.data.userId, data.data.data1.id, data.data.data1.name);
            text.value = ""
        }
        else if (text.value == "") {
            let data = await axios.post('http://54.160.107.218:3000/home/uploadFile', obj, { headers: { "Authorization": token } })
            socket.emit("chatMessage", "", data.data.data.imageUrl, data.data.data.id, data.data.data.userId, data.data.data1.id, data.data.data1.name);
            file.value = ""
        }
    }
    catch (err) {
        console.log(err);
    }
}

socket.on("message", (obj) => {
    retrieveTexts(obj)
})

async function retrieveTexts(obj) {
    const resp = await axios.get(`http://54.160.107.218:3000/home/getMsgData/${obj.id}`, { headers: { "Authorization": token } })
    console.log(obj);
    if (obj.userId != resp.data.data.id) {
        if (obj.url == "") {
            let text = `<div><p id=${obj.id} style="margin:10px 10px;text-align:right">${resp.data.data.name}:${obj.msg}</p></div>`
            table.innerHTML = table.innerHTML + text;
        }
        else if (obj.msg == "") {
            let text = `<div><p id=${obj.id} style="margin:10px 10px;text-align:right">${resp.data.data.name}:<a href="${obj.url}">file</a></p></div>`
            table.innerHTML = table.innerHTML + text;
        }
    }
    if (obj.userId == resp.data.data.id) {
        if (obj.url == "") {
            let text = `<div><p id=${obj.id} style="margin:10px 10px">You:${obj.msg}</p></div>`
            table.innerHTML = table.innerHTML + text;
        }
        else if (obj.msg == "") {
            let text = `<div><p id=${obj.id} style="margin:10px 10px">You:<a href="${obj.url}" download>file</a></p></div>`
            table.innerHTML = table.innerHTML + text;
        }
    }
}

function retrieveText(res) {
    var storedMsgs = JSON.parse(localStorage.messages);
    console.log(storedMsgs);
    table.innerHTML = ""
    for (let i = 0; i < storedMsgs.length; i++) {
        if (res.data.loggedUser.id == storedMsgs[i].userId) {
            if (storedMsgs[i].imageUrl == null) {
                let text = `<div><p id=${storedMsgs[i].id} style="margin:10px;">You:${storedMsgs[i].text}</p></div>`
                table.innerHTML = table.innerHTML + text;
            }
            else if (storedMsgs[i].text == null) {
                let text = `<div><p id=${storedMsgs[i].id} style="margin:10px;">You:<a href="${storedMsgs[i].imageUrl}"download>file</a></p></div>`
                table.innerHTML = table.innerHTML + text;
            }
        }
        else {
            let id = storedMsgs[i].userId
            for (let j = 0; j < res.data.users.length; j++) {
                if (id == res.data.users[j].id) {
                    var name = res.data.users[j].name
                }
            }
            if (storedMsgs[i].imageUrl == null) {
                let text = `<div><p id=${storedMsgs[i].id} style="margin:10px 10px;text-align:right">${name}:${storedMsgs[i].text}</p></div>`
                table.innerHTML = table.innerHTML + text;
            }
            else if (storedMsgs[i].text == null) {
                let text = `<div><p id=${storedMsgs[i].id} style="margin:10px 10px;text-align:right">${name}:<a href="${storedMsgs[i].imageUrl}"download>file</a></p></div>`
                table.innerHTML = table.innerHTML + text;
            }
        }
    }
}

var lastId;

async function getMsgs() {
    try {
        if (lastId == undefined) {
            lastId = -1
            table.innerHTML = ""
            const res = await axios.get(`http://54.160.107.218:3000/home/getMsg/${groupId}/${lastId}`, { headers: { "Authorization": token } })
            lastId = res.data.data[res.data.data.length - 1].id
            let j = 0
            let data1 = []
            if (res.data.data.length > 13) {
                for (let i = res.data.data.length - 13; i < res.data.data.length; i++) {
                    data1[j] = res.data.data[i]
                    j++
                }
                localStorage.setItem('messages', JSON.stringify(data1))
                retrieveText(res)
            }
            else {
                localStorage.setItem('messages', JSON.stringify(res.data.data))
                retrieveText(res)
            }
        }
        else {
            const resp = await axios.get(`http://54.160.107.218:3000/home/getMsg/${groupId}/${lastId}`, { headers: { "Authorization": token } })
            lastId = resp.data.data[resp.data.data.length - 1].id
            var a = [];
            a = JSON.parse(localStorage.getItem('messages'))
            if (a.length < 13) {
                a.push(resp.data.data[0]);
                localStorage.setItem('messages', JSON.stringify(a));
                retrieveText(resp)
            }
            else {
                a.shift();
                a.push(resp.data.data[0]);
                localStorage.setItem('messages', JSON.stringify(a));
                retrieveText(resp)
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const groups = await axios.get(`http://54.160.107.218:3000/home/getGroups`, { headers: { "Authorization": token } })
        for (let i = 0; i < groups.data.data[0].groups.length; i++) {
            getGroup(groups.data.data[0].groups[i])
        }
        if (lastId == undefined) {
            lastId = -1
            table.innerHTML = ""
            const res = await axios.get(`http://54.160.107.218:3000/home/getMsg/${groupId}/${lastId}`, { headers: { "Authorization": token } })
            lastId = res.data.data[res.data.data.length - 1].id
            let j = 0
            let data1 = []
            if (res.data.data.length > 13) {
                for (let i = res.data.data.length - 13; i < res.data.data.length; i++) {
                    data1[j] = res.data.data[i]
                    j++
                }
                localStorage.setItem('messages', JSON.stringify(data1))
                retrieveText(res)
            }
            else {
                localStorage.setItem('messages', JSON.stringify(res.data.data))
                retrieveText(res)
            }
        }
    }
    catch (err) {
        console.log(err);
    }
})

function getGroup(data, admin) {
    let btn = document.getElementById('sidenav')
    let btn1 = document.createElement('a')
    btn1.innerHTML = data.groupName
    btn1.value = data.id;
    btn.appendChild(btn1)
    console.log(data.userGroups);
    btn1.onclick = () => {
        groupId = btn1.value;
        if (data.userGroups.admin === true) {
            document.getElementById("addButton").style.display = "block"
            document.getElementById("removeButton").style.display = "block"
        }
        if (data.userGroups.admin === false) {
            document.getElementById("addButton").style.display = "none"
            document.getElementById("removeButton").style.display = "none"
        }
        localStorage.removeItem('messages')
        document.getElementById('partcipants').style.display = "none"
        document.getElementById('partcipant').style.display = "none"
        lastId = undefined
        getMsgs();
    }
}

function popup() {
    if (document.getElementById("popup").style.display == "block") {
        document.getElementById("popup").style.display = "none";
    }
    else {
        document.getElementById("popup").style.display = "block";
    }
}

async function createGroup(e) {
    try {
        e.preventDefault();
        let obj = {
            groupname: e.target[0].value,
            admin: true
        }
        document.getElementById("popup").style.display = "none";
        let data = await axios.post('http://54.160.107.218:3000/home/createGroup', obj, { headers: { "Authorization": token } })
        getGroup(data.data.data, admin)
    }
    catch (err) {
        console.log(err);
    }
}

async function showParticipants() {
    var btn = document.getElementById('select')
    while (btn.firstChild) {
        btn.removeChild(btn.firstChild);
    }
    if (document.getElementById('partcipants').style.display == "block") {
        document.getElementById('partcipants').style.display = "none"

    }
    else {
        document.getElementById('partcipants').style.display = "block"
        const data = await axios.get(`http://54.160.107.218:3000/home/getMembers/${groupId}`, { headers: { "Authorization": token } })
        for (let i = 0; i < data.data.data.length; i++) {
            var btn1 = document.createElement('option')
            btn1.innerHTML = data.data.data[i].name
            btn1.value = data.data.data[i].id
            btn.appendChild(btn1)
        }
    }
}

async function showParticipant() {
    var btn = document.getElementById('select1')
    while (btn.firstChild) {
        btn.removeChild(btn.firstChild);
    }
    if (document.getElementById('partcipant').style.display == "block") {
        document.getElementById('partcipant').style.display = "none"
    }
    else {
        document.getElementById('partcipant').style.display = "block"
        const data = await axios.get(`http://54.160.107.218:3000/home/getMember/${groupId}`, { headers: { "Authorization": token } })
        for (let i = 0; i < data.data.data[0].users.length; i++) {
            var btn1 = document.createElement('option')
            btn1.innerHTML = data.data.data[0].users[i].name
            btn1.value = data.data.data[0].users[i].id
            btn.appendChild(btn1)
        }
    }
}

async function removeFromGroup(e) {
    try {
        e.preventDefault();
        document.getElementById('partcipant').style.display = "none"
        let data = await axios.delete(`http://54.160.107.218:3000/home/removeFromGroup/${groupId}/${e.target[0].value}`, { headers: { "Authorization": token } })
        let text = '<div><p style="color:red;text-align:center">Member removed from the group successfully..!</p></div>'
        table.innerHTML = table.innerHTML + text
    }
    catch (err) {
        console.log(err);
    }
}

async function addToGroup(e) {
    try {
        e.preventDefault();
        let obj = {
            userId: e.target[0].value,
            groupId: groupId,
            admin: e.target[1].checked
        }
        document.getElementById('partcipants').style.display = "none"
        let data = await axios.post('http://54.160.107.218:3000/home/addToGroup', obj, { headers: { "Authorization": token } })
        let text = '<div><p style="color:red;text-align:center">Member added to the group successfully..!</p></div>'
        table.innerHTML = table.innerHTML + text
    }
    catch (err) {
        console.log(err);
        let text = '<div><p style="color:red;text-align:center">Member is already added to the group..!</p></div>'
        table.innerHTML = table.innerHTML + text
    }
}