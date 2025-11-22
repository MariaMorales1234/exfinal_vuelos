let currentUser = null;
document.addEventListener('DOMContentLoaded', async () => {
    // Validar sesión y rol
    const isValid = await validateSession();
    if (!isValid) return;
    requireRole(['gestor', 'administrador']);
    // Obtener usuario actual
    currentUser = getCurrentUser();
    document.getElementById('userInfo').innerHTML = `
        <p><strong>${currentUser.name}</strong></p>
        <p>${currentUser.email}</p>
        <p><span class="badge badge-${currentUser.role}">${currentUser.role}</span></p>
    `;
    // Cargar todos los vuelos
    await loadFlightsCatalog();
    // Eventos
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Cerrar sesión?')) await handleLogout();
    });
    document.getElementById('btnSearchFlights').addEventListener('click', handleSearchFlights);
    document.getElementById('btnShowAll').addEventListener('click', () => {
        document.getElementById('searchOrigin').value = '';
        document.getElementById('searchDestination').value = '';
        document.getElementById('searchDate').value = '';
        loadFlightsCatalog();
    });
    document.getElementById('btnCancelReservation').addEventListener('click', closeReservationModal);
    document.querySelector('.close').addEventListener('click', closeReservationModal);
    document.getElementById('reservationForm').addEventListener('submit', handleCreateReservation);
});
// Cargar catálogo de vuelos
const loadFlightsCatalog = async () => {
    try {
        toggleLoading(true);
        const response = await flightsAPI.getAll();
        const catalog = document.getElementById('flightsCatalog');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            catalog.innerHTML = response.data.map(flight => createFlightCard(flight)).join('');
        } else {
            catalog.innerHTML = '<p style="text-align: center;">No hay vuelos disponibles</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar vuelos', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Crear tarjeta de vuelo
const createFlightCard = (flight) => {
    return `
        <div class="flight-card">
            <div class="flight-card-header">
                <h3>${flight.origin} → ${flight.destination}</h3>
                <span class="flight-price">${formatPrice(flight.price)}</span>
            </div>
            <div class="flight-card-body">
                <div class="flight-info">
                    <div class="info-item">
                        <strong>Nave:</strong> ${flight.nave ? flight.nave.name : 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Modelo:</strong> ${flight.nave ? flight.nave.model : 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Capacidad:</strong> ${flight.nave ? flight.nave.capacity : 'N/A'} pasajeros
                    </div>
                </div>
                <div class="flight-schedule">
                    <div class="schedule-item">
                        <strong>Salida:</strong> ${formatDate(flight.departure)}
                    </div>
                    <div class="schedule-item">
                        <strong>Llegada:</strong> ${formatDate(flight.arrival)}
                    </div>
                </div>
            </div>
            <div class="flight-card-footer">
                <button class="btn btn-success" onclick="openReservationModal(${flight.id})">
                    Reservar Vuelo
                </button>
            </div>
        </div>
    `;
};
// Buscar vuelos
const handleSearchFlights = async () => {
    try {
        toggleLoading(true);
        const params = {};
        const origin = document.getElementById('searchOrigin').value.trim();
        const destination = document.getElementById('searchDestination').value.trim();
        const date = document.getElementById('searchDate').value;
        if (origin) params.origin = origin;
        if (destination) params.destination = destination;
        if (date) params.date = date;
        if (Object.keys(params).length === 0) {
            await loadFlightsCatalog();
            return;
        }
        const response = await flightsAPI.search(params);
        const catalog = document.getElementById('flightsCatalog');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            catalog.innerHTML = response.data.map(flight => createFlightCard(flight)).join('');
        } else {
            catalog.innerHTML = '<p style="text-align: center;">No se encontraron vuelos con esos criterios</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al buscar vuelos', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Abrir modal de reserva
const openReservationModal = async (flightId) => {
    try {
        toggleLoading(true);
        const response = await flightsAPI.getById(flightId);
        if (response.status === 'success' && response.data) {
            const flight = response.data;
            // Mostrar detalles del vuelo
            document.getElementById('flightDetails').innerHTML = `
                <div class="flight-summary">
                    <h3>${flight.origin} → ${flight.destination}</h3>
                    <p><strong>Nave:</strong> ${flight.nave ? flight.nave.name : 'N/A'}</p>
                    <p><strong>Salida:</strong> ${formatDate(flight.departure)}</p>
                    <p><strong>Llegada:</strong> ${formatDate(flight.arrival)}</p>
                    <p class="price-highlight"><strong>Precio:</strong> ${formatPrice(flight.price)}</p>
                </div>
            `;
            // Llenar datos del formulario
            document.getElementById('selectedFlightId').value = flightId;
            document.getElementById('passengerName').value = currentUser.name;
            document.getElementById('passengerEmail').value = currentUser.email;
            document.getElementById('reservationModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar detalles del vuelo', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Crear reserva
const handleCreateReservation = async (e) => {
    e.preventDefault();
    const reservationData = {
        user_id: currentUser.id,
        flight_id: parseInt(document.getElementById('selectedFlightId').value)
    };
    try {
        toggleLoading(true);
        const response = await reservationsAPI.create(reservationData);

        if (response.status === 'success') {
            showAlert('¡Reserva realizada exitosamente!', 'success');
            closeReservationModal();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al crear reserva', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Cerrar modal
const closeReservationModal = () => {
    document.getElementById('reservationModal').style.display = 'none';
    document.getElementById('reservationForm').reset();
};