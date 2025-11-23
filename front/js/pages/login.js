document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya está logueado
    if (isAuthenticated()) {
        redirectByRole();
    }
    // Obtener elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('errorMessage');
    // Manejar submit del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        // Limpiar mensaje de error
        errorDiv.textContent = '';
        // Validar campos
        if (!email || !password) {
            errorDiv.textContent = 'Por favor complete todos los campos';
            return;
        }
        // Mostrar loading
        toggleLoading(true);
        try {
            const result = await handleLogin(email, password);
            if (!result.success) {
                errorDiv.textContent = result.message || 'Error al iniciar sesión';
            }
        } catch (error) {
            errorDiv.textContent = 'Error de conexión con el servidor';
            console.error('Error:', error);
        } finally {
            toggleLoading(false);
        }
    });
});