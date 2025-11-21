const usersAPI = {
    // Login
    login: async (email, password) => {
        const response = await fetch(`${API_USERS}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    },
    // Validar token
    validate: async () => {
        const response = await fetch(`${API_USERS}/auth/validate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Logout
    logout: async () => {
        const response = await fetch(`${API_USERS}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Listar usuarios
    getAll: async () => {
        const response = await fetch(`${API_USERS}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Obtener usuario por ID
    getById: async (id) => {
        const response = await fetch(`${API_USERS}/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Crear usuario
    create: async (userData) => {
        const response = await fetch(`${API_USERS}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },
    // Actualizar usuario
    update: async (id, userData) => {
        const response = await fetch(`${API_USERS}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },
    // Eliminar usuario
    delete: async (id) => {
        const response = await fetch(`${API_USERS}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    }
};