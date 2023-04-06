const table = document.getElementById('div');
const text = document.getElementById('text')
const token = localStorage.getItem('token')

async function postText(e) {
    try {
        e.preventDefault();
        let obj = {
            text: text.value
        }
        let data = await axios.post('http://localhost:3000/home/sendMsg', obj, { headers: { "Authorization": token } })
        text.value = ""
        
    }
    catch (err) {
        console.log(err);
    }
}

function retrieveText(res) {
    let data1 = res.data.data
    var storedMsgs = JSON.parse(localStorage.messages);
    console.log(storedMsgs);
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
                    console.log(name);
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
        if (lastId == undefined) {
            lastId = -1
            table.innerHTML = ""
            console.log('hi');
            const res = await axios.get(`http://localhost:3000/home/getMsg/${lastId}`, { headers: { "Authorization": token } })
            lastId = res.data.data[res.data.data.length - 1].id
            localStorage.setItem('messages', JSON.stringify(res.data.data))
            retrieveText(res)
        }
        else {
            console.log('hello');
            const resp = await axios.get(`http://localhost:3000/home/getMsg/${lastId}`, { headers: { "Authorization": token } })
            console.log(resp);
            lastId = resp.data.data[resp.data.data.length - 1].id
            console.log(lastId);
            var a = [];
            a = JSON.parse(localStorage.getItem('messages'))
            console.log(a.shift());
            a.push(resp.data.data[0]);
            localStorage.setItem('messages', JSON.stringify(a));
            retrieveText(resp)
        }
    }
    catch (err) {
        console.log(err);
    }
},1000)

window.addEventListener('DOMContentLoaded', async () => {
    try {
        if (lastId == undefined) {
            lastId = -1
            table.innerHTML = ""
            console.log('hi');
            const res = await axios.get(`http://localhost:3000/home/getMsg/${lastId}`, { headers: { "Authorization": token } })
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
