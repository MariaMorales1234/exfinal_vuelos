const navesAPI = {
    // Listar naves
    getAll: async () => {
        const response = await fetch(`${API_FLIGHTS}/naves`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Obtener nave por ID
    getById: async (id) => {
        const response = await fetch(`${API_FLIGHTS}/naves/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Crear nave
    create: async (naveData) => {
        const response = await fetch(`${API_FLIGHTS}/naves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(naveData)
        });
        return await response.json();
    },
    // Actualizar nave
    update: async (id, naveData) => {
        const response = await fetch(`${API_FLIGHTS}/naves/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(naveData)
        });
        return await response.json();
    },
    // Eliminar nave
    delete: async (id) => {
        const response = await fetch(`${API_FLIGHTS}/naves/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    }
};