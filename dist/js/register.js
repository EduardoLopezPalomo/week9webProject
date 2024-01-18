
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const handleAuthError = (error) => {
        const errorMessageElement = document.getElementById('errorMessage');

        if (error.message === 'Email already in use') {
            errorMessageElement.textContent = 'Email is already in use';
        } else if (error.message === 'Invalid credentials') {
            errorMessageElement.textContent = 'Invalid email or password';
        } else {
            errorMessageElement.textContent = 'An error occurred during authentication';
        }

        errorMessageElement.style.display = 'block';
    };

    fetch('/api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login.html';
        } else {
            console.error('Registration failed');
        }
    })
    .catch((error) => handleAuthError(error.response.data));
});

