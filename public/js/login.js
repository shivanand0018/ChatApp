var email = document.getElementById('email');
var password = document.getElementById('password');

async function checkUser(e) {
    try {
        e.preventDefault();
        let obj = {
            email: email.value,
            password: password.value
        }
        let data = await axios.post('http://localhost:3000/login/checkUser', obj)
        if (data.status == 200) {
            alert(data.data.data)
            window.location.href = "/home";
            localStorage.setItem('token', data.data.token)
        }
    }
    catch (err) {
        console.log(err.response.data.data);
        if (document.getElementById('id')) {
            form.removeChild(document.getElementById('id'))
        }
        if (err.response.status == 400 || err.response.status == 404) {
            var p = document.createElement('p')
            p.id = 'id'
            let text = `<h3 style="color:red">${err.response.data.data}<h3>`
            p.innerHTML = p.innerHTML + text;
            form.appendChild(p)
        }

    }
}