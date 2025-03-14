document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;

    const userDTO = {
        username: username,
        email: email,
        password: password
    };

    fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDTO)
    })
    .then(response => {
        if (response.ok) {
            return response.text(); 
        } else {
            throw new Error('Signup failed: ' + response.statusText);
        }
    })
    .then(message => {
        
        Swal.fire({
            icon: 'success',
            title: 'Signup Successful',
            text: message
        }).then(() => {
            
            document.querySelector('.signup-container').style.display = 'none';
            document.querySelector('.login-container').style.display = 'block';
        });
    })
    .catch(error => {
        
        Swal.fire({
            icon: 'error',
            title: 'Signup Failed',
            text: error.message || 'Signup failed. Please try again.'
        });
        console.error('Signup Error:', error);
    });
});