const flightsAPI = {
    // Listar vuelos
    getAll: async () => {
        const response = await fetch(`${API_FLIGHTS}/flights`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Obtener vuelo por ID
    getById: async (id) => {
        const response = await fetch(`${API_FLIGHTS}/flights/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Buscar vuelos
    search: async (params) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_FLIGHTS}/flights/search?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Crear vuelo
    create: async (flightData) => {
        const response = await fetch(`${API_FLIGHTS}/flights`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(flightData)
        });
        return await response.json();
    },
    // Actualizar vuelo
    update: async (id, flightData) => {
        const response = await fetch(`${API_FLIGHTS}/flights/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(flightData)
        });
        return await response.json();
    },
    // Eliminar vuelo
    delete: async (id) => {
        const response = await fetch(`${API_FLIGHTS}/flights/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    }
};