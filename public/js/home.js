const table = document.getElementById('div');
const text = document.getElementById('text')
const token = localStorage.getItem('token')
var groupId;

async function postText(e) {
    try {
        e.preventDefault();
        let obj = {
            text: text.value,
            groupId: groupId
        }
        let data = await axios.post('http://localhost:3000/home/sendMsg', obj, { headers: { "Authorization": token } })
        text.value = ""
        //retrieveText(data)
    }
    catch (err) {
        console.log(err);
    }
}

function retrieveText(res) {
    let data1 = res.data.data
    console.log(data1);
    var storedMsgs = JSON.parse(localStorage.messages);
    table.innerHTML = ""
    for (let i = 0; i < storedMsgs.length; i++) {
        if (res.data.loggedUser.id == storedMsgs[i].userId) {
            let text = `<div><p id=${storedMsgs[i].id} style="margin:10px;">You:${storedMsgs[i].text}</p></div>`
            table.innerHTML = table.innerHTML + text;
        }
        else {
            let id = storedMsgs[i].userId
            for (let j = 0; j < res.data.users.length; j++) {
                if (id == res.data.users[j].id) {
                    var name = res.data.users[j].name
                }
            }
            let text = `<div><p id=${storedMsgs[i].id} style="margin:10px 10px;text-align:right">${name}:${storedMsgs[i].text}</p></div>`
            table.innerHTML = table.innerHTML + text;
        }
    }
}

var lastId;

setInterval(async function getMsgs() {
    try {
        console.log(groupId);
        if (lastId == undefined) {
            lastId = -1
            table.innerHTML = ""
            const res = await axios.get(`http://localhost:3000/home/getMsg/${groupId}/${lastId}`, { headers: { "Authorization": token } })
            lastId = res.data.data[res.data.data.length - 1].id
            localStorage.setItem('messages', JSON.stringify(res.data.data))
            retrieveText(res)
        }
        else {
            const resp = await axios.get(`http://localhost:3000/home/getMsg/${groupId}/${lastId}`, { headers: { "Authorization": token } })
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
}, 1000)

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const groups = await axios.get(`http://localhost:3000/home/getGroups`, { headers: { "Authorization": token } })
        for (let i = 0; i < groups.data.data[0].groups.length; i++) {
            getGroup(groups.data.data[0].groups[i])
        }
        if (lastId == undefined) {
            lastId = -1
            table.innerHTML = ""
            const res = await axios.get(`http://localhost:3000/home/getMsg/${groupId}/${lastId}`, { headers: { "Authorization": token } })
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



function getGroup(data) {
    console.log(data);
    let btn = document.getElementById('sidenav')
    let btn1 = document.createElement('a')
    btn1.innerHTML = data.groupName
    btn1.value = data.id;
    btn.appendChild(btn1)
    btn1.onclick = () => {
        console.log(btn1.value);
        groupId = btn1.value
        
        localStorage.removeItem('messages')
        lastId = undefined
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
        e.preventDefault()
        console.log(e.target[0].value);
        let obj = {
            groupname: e.target[0].value
        }
        document.getElementById("popup").style.display = "none";
        let data = await axios.post('http://localhost:3000/home/createGroup', obj, { headers: { "Authorization": token } })
        getGroup(data.data.data)
    }
    catch (err) {
        console.log(err);
    }
}

async function showParticipants() {
    if (document.getElementById('partcipants').style.display == "block") {
        document.getElementById('partcipants').style.display = "none"
    }
    else {
        document.getElementById('partcipants').style.display = "block"
        const data = await axios.get(`http://localhost:3000/home/getMembers`, { headers: { "Authorization": token } })
        console.log(data.data);
        let btn = document.getElementById('select')
        for (let i = 0; i < data.data.data.length; i++) {
            let btn1 = document.createElement('option')
            btn1.innerHTML = data.data.data[i].name
            btn1.value = data.data.data[i].id
            btn.appendChild(btn1)
        }
    }
}

async function addToGroup(e) {
    try {
        e.preventDefault();
        let obj = {
            userId: e.target[0].value,
            groupId: groupId
        }
        document.getElementById('partcipants').style.display = "none"
        console.log(obj);
        let data = await axios.post('http://localhost:3000/home/addToGroup', obj, { headers: { "Authorization": token } })
        console.log(data);
        let message = `Member added to the group <br>successfully..!`
        let btn = document.createElement('p')
        btn.style.color = 'red'
        btn.innerHTML = message
        let btn1 = document.getElementById('message')
        btn1.appendChild(btn)
    }
    catch (err) {
        console.log(err);
    }
}