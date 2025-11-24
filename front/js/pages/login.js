document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        redirectByRole();
    }
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('errorMessage');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        errorDiv.textContent = '';
        if (!email || !password) {
            errorDiv.textContent = 'Por favor complete todos los campos';
            return;
        }
        try {
            const result = await handleLogin(email, password);
            if (!result.success) {
                errorDiv.textContent = result.message || 'Error al iniciar sesión';
            }
        } catch (error) {
            errorDiv.textContent = 'Error de conexión con el servidor';
            console.error('Error:', error);
        }
    });
});