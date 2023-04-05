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
        console.log(data);
        text.value = ""
        getMsgs()
        
    }
    catch (err) {
        console.log(err);
    }
}

function retrieveText(res) {
    let data1 = res.data.data
    for (let i = 0; i < data1.length; i++) {
        if (res.data.loggedUser.id == data1[i].userId) {
            let text = `<div><p id=${data1[i].id} style="margin:10px;">You:${data1[i].text}</p></div>`
            table.innerHTML = table.innerHTML + text;
        }
        else{
            let id=data1[i].userId
            for(let j=0;j<res.data.users.length;j++)
            {
                if(id==res.data.users[j].id)
                {
                    var name=res.data.users[j].name
                    console.log(name);
                }
            }
            let text = `<div><p id=${data1[i].id} style="margin:10px 10px;text-align:right">${name}:${data1[i].text}</p></div>`
            table.innerHTML = table.innerHTML + text;
        }
    }
}

setInterval(async function getMsgs() {
    try {
        table.innerHTML = ""
        const res = await axios.get('http://localhost:3000/home/getMsg', { headers: { "Authorization": token } })
        console.log(res);
        retrieveText(res)
    }
    catch (err) {
        console.log(err);
    }
}, 5000)

window.addEventListener('DOMContentLoaded', async () => {
    try {
        table.innerHTML = ""
        const res = await axios.get('http://localhost:3000/home/getMsg', { headers: { "Authorization": token } })
        retrieveText(res)

    }
    catch (err) {
        console.log(err);
    }
})
