const reservationsAPI = {
    // Listar reservas
    getAll: async () => {
        const response = await fetch(`${API_FLIGHTS}/reservations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Obtener reserva por ID
    getById: async (id) => {
        const response = await fetch(`${API_FLIGHTS}/reservations/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Obtener reservas por usuario
    getByUser: async (userId) => {
        const response = await fetch(`${API_FLIGHTS}/reservations/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Crear reserva
    create: async (reservationData) => {
        const response = await fetch(`${API_FLIGHTS}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(reservationData)
        });
        return await response.json();
    },
    // Cancelar reserva
    cancel: async (id) => {
        const response = await fetch(`${API_FLIGHTS}/reservations/${id}/cancel`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    },
    // Eliminar reserva
    delete: async (id) => {
        const response = await fetch(`${API_FLIGHTS}/reservations/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return await response.json();
    }
};