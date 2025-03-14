document.getElementById('show-signup').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.signup-container').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.signup-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('USERNAME').value;
    const password = document.getElementById('PASSWORD').value;

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.text(); 
        } else {
            throw new Error('Login failed: Invalid credentials or server error');
        }
    })
    .then(message => {
        
        Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: message
        }).then(() => {
            
            document.querySelector('.login-container').style.display = 'none';
            document.getElementById('app-content').style.display = 'block';
        });
    })
    .catch(error => {
       
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message || 'Incorrect username or password. Please try again.'
        });
        console.error('Login Error:', error);
    });
});