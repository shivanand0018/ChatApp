const table = document.getElementById('div');
const text=document.getElementById('text')

async function postText(e)
{
    e.preventDefault();
    let obj = {
        text:text.value
    }
    let data = await axios.post('http://localhost:3000/home/sendMsg', obj)
}

function getText(data)
{
    let text=`<tr id=${data.id}><td>${data.text}</td></tr>`
    table.innerHTML=table.innerHTML+text;
}

window.addEventListener('DOMContentLoaded', async () => {
    const res=await axios.get('http://localhost:3000/home/getMsg')
    console.log(res);
})