let editingFlightId = null;
let navesData = [];
document.addEventListener('DOMContentLoaded', async () => {
    // Validar sesión y rol
    const isValid = await validateSession();
    if (!isValid) return;
    requireRole(['administrador']);
    // Mostrar info usuario
    const user = getCurrentUser();
    document.getElementById('userInfo').innerHTML = `
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>
        <p><span class="badge">${user.role}</span></p>
    `;
    // Cargar naves para el selector
    await loadNavesForSelect();
    // Cargar vuelos
    await loadFlights();
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Cerrar sesión?')) await handleLogout();
    });
    document.getElementById('btnNewFlight').addEventListener('click', openNewFlightForm);
    document.getElementById('btnCancelFlight').addEventListener('click', closeForm);
    document.querySelector('.close').addEventListener('click', closeForm);
    document.getElementById('flightForm').addEventListener('submit', handleSubmitFlight);
    document.getElementById('btnSearch').addEventListener('click', handleSearch);
    document.getElementById('btnClearFilters').addEventListener('click', clearFilters);
});
// Cargar naves para el selector
const loadNavesForSelect = async () => {
    try {
        const response = await naves.getAll();
        if (response.status === 'success' && response.data) {
            navesData = response.data;
            const select = document.getElementById('flightNave');
            select.innerHTML = '<option value="">Seleccione una nave</option>' +
                navesData.map(nave => `<option value="${nave.id}">${nave.name} - ${nave.model}</option>`).join('');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
// Cargar vuelos
const loadFlights = async () => {
    try {
        const response = await flights.getAll();
        const tbody = document.getElementById('flightsTableBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(flight => `
                <tr>
                    <td>${flight.id}</td>
                    <td>${flight.nave ? flight.nave.name : 'N/A'}</td>
                    <td>${flight.origin}</td>
                    <td>${flight.destination}</td>
                    <td>${formatDate(flight.departure)}</td>
                    <td>${formatDate(flight.arrival)}</td>
                    <td>${formatPrice(flight.price)}</td>
                    <td class="table-actions">
                        <button class="btn-sm" onclick="editFlight(${flight.id})">Editar</button>
                        <button class="btn-sm" onclick="deleteFlight(${flight.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay vuelos registrados</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar vuelos', 'error');
    }
};
// Buscar vuelos
const handleSearch = async () => {
    try {
        const params = {};
        const origin = document.getElementById('filterOrigin').value.trim();
        const destination = document.getElementById('filterDestination').value.trim();
        const date = document.getElementById('filterDate').value;
        if (origin) params.origin = origin;
        if (destination) params.destination = destination;
        if (date) params.date = date;
        if (Object.keys(params).length === 0) {
            await loadFlights();
            return;
        }
        const response = await flights.search(params);
        const tbody = document.getElementById('flightsTableBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(flight => `
                <tr>
                    <td>${flight.id}</td>
                    <td>${flight.nave ? flight.nave.name : 'N/A'}</td>
                    <td>${flight.origin}</td>
                    <td>${flight.destination}</td>
                    <td>${formatDate(flight.departure)}</td>
                    <td>${formatDate(flight.arrival)}</td>
                    <td>${formatPrice(flight.price)}</td>
                    <td class="table-actions">
                        <button class="btn-sm" onclick="editFlight(${flight.id})">Editar</button>
                        <button class="btn-sm" onclick="deleteFlight(${flight.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No se encontraron vuelos</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al buscar vuelos', 'error');
    }
};
// Limpiar filtros
const clearFilters = () => {
    document.getElementById('filterOrigin').value = '';
    document.getElementById('filterDestination').value = '';
    document.getElementById('filterDate').value = '';
    loadFlights();
};
// Abrir modal nuevo vuelo
const openNewFlightForm = () => {
    editingFlightId = null;
    document.getElementById('formTitle').textContent = 'Nuevo Vuelo';
    document.getElementById('flightForm').reset();
    document.getElementById('flightId').value = '';
    document.getElementById('flightformcreate').style.display = 'flex';
};
// Editar vuelo
const editFlight = async (id) => {
    try {
        const response = await flights.getById(id);
        if (response.status === 'success' && response.data) {
            editingFlightId = id;
            document.getElementById('formTitle').textContent = 'Editar Vuelo';
            document.getElementById('flightId').value = response.data.id;
            document.getElementById('flightNave').value = response.data.nave_id;
            document.getElementById('flightOrigin').value = response.data.origin;
            document.getElementById('flightDestination').value = response.data.destination;
            // Formatear fechas para datetime-local
            const departure = new Date(response.data.departure);
            const arrival = new Date(response.data.arrival);
            document.getElementById('flightDeparture').value = formatDateTimeLocal(departure);
            document.getElementById('flightArrival').value = formatDateTimeLocal(arrival);
            document.getElementById('flightPrice').value = response.data.price;
            document.getElementById('flightformcreate').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar vuelo', 'error');
    } 
};
// Eliminar vuelo
const deleteFlight = async (id) => {
    if (!confirmAction('¿Eliminar este vuelo?')) return;
    try {
        const response = await flights.delete(id);
        if (response.status === 'success') {
            showAlert('Vuelo eliminado', 'success');
            await loadFlights();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar vuelo', 'error');
    }
};
// Manejar submit del formulario
const handleSubmitFlight = async (e) => {
    e.preventDefault();
    const flightData = {
        nave_id: parseInt(document.getElementById('flightNave').value),
        origin: document.getElementById('flightOrigin').value.trim(),
        destination: document.getElementById('flightDestination').value.trim(),
        departure: document.getElementById('flightDeparture').value.replace('T', ' ') + ':00',
        arrival: document.getElementById('flightArrival').value.replace('T', ' ') + ':00',
        price: parseFloat(document.getElementById('flightPrice').value)
    };
    try {
        let response;
        if (editingFlightId) {
            response = await flights.update(editingFlightId, flightData);
        } else {
            response = await flights.create(flightData);
        }
        if (response.status === 'success') {
            showAlert(editingFlightId ? 'Vuelo actualizado' : 'Vuelo creado', 'success');
            closeForm();
            await loadFlights();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar vuelo', 'error');
    } 
};
// Formatear fecha para input datetime-local
const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
// Cerrar modal
const closeForm = () => {
    document.getElementById('flightformcreate').style.display = 'none';
    document.getElementById('flightForm').reset();
    editingFlightId = null;
};