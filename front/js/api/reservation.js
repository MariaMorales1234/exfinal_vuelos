const reservations = {
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