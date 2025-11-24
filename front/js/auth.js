const saveSession = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const hasRole = (role) => {
    const user = getCurrentUser();
    return user && user.role === role;
};

const redirectByRole = () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/index.html';
        return;
    }
    if (user.role === 'administrador') {
        window.location.href = '/admin/inicio.html';
    } else if (user.role === 'gestor') {
        window.location.href = '/gestor/inicio.html';
    }
};

const validateSession = async () => {
    if (!isAuthenticated()) {
        window.location.href = '/index.html';
        return false;
    }
    try {
        const response = await users.validate();
        if (response.status !== 'success') {
            clearSession();
            window.location.href = '/index.html';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error validando sesión:', error);
        clearSession();
        window.location.href = '/index.html';
        return false;
    }
};

const handleLogin = async (email, password) => {
    try {
        const response = await users.login(email, password);

        if (response.status === 'success') {
            saveSession(response.data.token, response.data.user);
            redirectByRole();
            return { success: true };
        } else {
            return { success: false, message: response.message };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, message: 'Error de conexión' };
    }
};

const handleLogout = async () => {
    try {
        await users.logout();
    } catch (error) {
        console.error('Error en logout:', error);
    } finally {
        clearSession();
        window.location.href = '/index.html';
    }
};

const requireRole = (allowedRoles) => {
    const user = getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
        alert('No tienes permisos para acceder a esta página');
        redirectByRole();
    }
};