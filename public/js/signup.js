var userName = document.getElementById('userName');
var email = document.getElementById('email');
var phone = document.getElementById('phone')
var password = document.getElementById('password')
var repassword = document.getElementById('re-password')
var form = document.getElementById('form')

async function addUser(e) {
    try {
        if (userName.value == "" || email.value == "" || phone.value == "" || password.value == "" || repassword.value == "") {
            alert('please fill all the fields')
        }
        else {
            e.preventDefault();
            if (password.value == repassword.value) {

                const obj = {
                    name: userName.value,
                    email: email.value,
                    phone: phone.value,
                    password: password.value
                }
                const response = await axios.post('http://localhost:3000/signup/addUser', obj)
                userName.value = ""
                email.value = ""
                phone.value = ""
                password.value = ""
                repassword.value = ""
                if (document.getElementById('id')) {
                    form.removeChild(document.getElementById('id'))
                }
                var p = document.createElement('p')
                p.id = 'id'
                let text = `<h4 style="color:red">User successfully Registered....! Please Login<h4>`
                p.innerHTML = p.innerHTML + text;
                form.appendChild(p)
            }
            else {
                var p = document.createElement('p')
                p.id = 'id'
                let text = `<h4 style="color:red">Passwords doesn't Match....! Please Check<h4>`
                p.innerHTML = p.innerHTML + text;
                form.appendChild(p)
            }
        }
    }
    catch (err) {
        console.log(err);
        if (document.getElementById('id')) {
            form.removeChild(document.getElementById('id'))
        }
        var p = document.createElement('p')
        p.id = 'id'
        let text = `<h3 style="color:red">Emailid Already Registered....!<h3>`
        p.innerHTML = p.innerHTML + text;
        form.appendChild(p)
    }
}