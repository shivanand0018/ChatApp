const table = document.getElementById('div');
const text = document.getElementById('text')
const token = localStorage.getItem('token')

async function postText(e) {
    e.preventDefault();
    let obj = {
        text: text.value
    }
    let data = await axios.post('http://localhost:3000/home/sendMsg', obj, { headers: { "Authorization": token } })
    console.log(data);
    retrieveText(data.data.data)
    text.value = ""
}

function retrieveText(data) {
    let text = `<p id=${data.id} style="border-bottom:1px solid black;">${data.text}</p>`
    table.innerHTML = table.innerHTML + text;
}

window.addEventListener('DOMContentLoaded', async () => {
    const res = await axios.get('http://localhost:3000/home/getMsg', { headers: { "Authorization": token } })
    for (let i = 0; i < res.data.data.length; i++) {
        retrieveText(res.data.data[i])
    }
})