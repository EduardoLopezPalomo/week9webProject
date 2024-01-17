document.addEventListener('DOMContentLoaded', () => {
    const userInfoElement = document.getElementById('userInfo');
    const authButtonsElement = document.getElementById('authButtons');
    const logoutButton = document.getElementById('logout');

    const isAuthenticated = () => {
        return !!localStorage.getItem('auth_token');
    };

    const updateUI = () => {
        if (isAuthenticated()) {
            const token = localStorage.getItem('auth_token');
            const decodedToken = jwt_decode(token);

            userInfoElement.textContent = `Welcome, ${decodedToken.email}`;
            authButtonsElement.innerHTML = '';
            logoutButton.style.display = 'block';
        } else {
            userInfoElement.textContent = '';
            authButtonsElement.innerHTML = `
                <a href="/register.html">Register</a>
                <a href="/login.html">Login</a>
            `;
            logoutButton.style.display = 'none';
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        updateUI();
    };

    logoutButton.addEventListener('click', logout);

    updateUI();
    
});
