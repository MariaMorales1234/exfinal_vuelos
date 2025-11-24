let flightsData = [];
document.addEventListener('DOMContentLoaded', async () => {
    const isValid = await validateSession();
    if (!isValid) return;
    requireRole(['gestor']);
    const user = getCurrentUser();
    document.getElementById('userInfo').innerHTML = `
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>
    `;
    await loadFlightsForSelect();
    await loadAllReservations();
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Cerrar sesión?')) await handleLogout();
    });
    document.getElementById('btnNewReservation').addEventListener('click', openNewReservationForm);
    document.getElementById('btnCancelReservation').addEventListener('click', closeForm);
    document.querySelector('.close').addEventListener('click', closeForm);
    document.getElementById('reservationForm').addEventListener('submit', handleSubmitReservation);
    document.getElementById('btnSearchByUser').addEventListener('click', handleSearchByUser);
});

const loadFlightsForSelect = async () => {
    try {
        const response = await flights.getAll();
        if (response.status === 'success' && response.data) {
            flightsData = response.data;
            const select = document.getElementById('flightId');
            select.innerHTML = '<option value="">Seleccione un vuelo</option>' +
                flightsData.map(flight => `
                    <option value="${flight.id}">
                        ${flight.origin} → ${flight.destination} - ${formatDate(flight.departure)}
                    </option>
                `).join('');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const loadAllReservations = async () => {
    try {
        const response = await reservations.getAll();
        const tbody = document.getElementById('allReservationsBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(reservation => createReservationRow(reservation)).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay reservas</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar reservas', 'error');
    }
};

const handleSearchByUser = async () => {
    const userId = document.getElementById('searchUserId').value.trim();
    if (!userId) {
        showAlert('Ingrese un ID de usuario', 'error');
        return;
    }
    try {
        const response = await reservations.getByUser(userId);
        const tbody = document.getElementById('userReservationsBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(reservation => createReservationRow(reservation)).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Este usuario no tiene reservas</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al buscar reservas', 'error');
        document.getElementById('userReservationsBody').innerHTML = 
            '<tr><td colspan="8" style="text-align: center;">Error al buscar reservas</td></tr>';
    }
};

const createReservationRow = (reservation) => {
    return `
        <tr>
            <td>${reservation.id}</td>
            <td>${reservation.user_id}</td>
            <td>${reservation.flight_id}</td>
            <td>${reservation.flight ? reservation.flight.origin : 'N/A'}</td>
            <td>${reservation.flight ? reservation.flight.destination : 'N/A'}</td>
            <td>${reservation.flight ? formatDate(reservation.flight.departure) : 'N/A'}</td>
            <td><span class="badge badge-${reservation.status}">${reservation.status}</span></td>
            <td class="table-actions">
                ${reservation.status === 'activa' ? 
                    `<button class="btn-sm" onclick="cancelReservation(${reservation.id})">Cancelar</button>` : 
                    '<span>Cancelada</span>'}
                <button class="btn-sm" onclick="deleteReservation(${reservation.id})">Eliminar</button>
            </td>
        </tr>
    `;
};

const openNewReservationForm = () => {
    document.getElementById('formTitle').textContent = 'Nueva Reserva';
    document.getElementById('reservationForm').reset();
    document.getElementById('reservationId').value = '';
    document.getElementById('reservationformcreate').style.display = 'flex';
};

const cancelReservation = async (id) => {
    if (!confirmAction('¿Cancelar esta reserva?')) return;
    try {
        const response = await reservations.cancel(id);
        if (response.status === 'success') {
            showAlert('Reserva cancelada exitosamente', 'success');
            await loadAllReservations();
            const searchUserId = document.getElementById('searchUserId').value.trim();
            if (searchUserId) {
                await handleSearchByUser();
            }
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cancelar reserva', 'error');
    }
};

const deleteReservation = async (id) => {
    if (!confirmAction('¿Eliminar esta reserva permanentemente?')) return;
    try {
        const response = await reservations.delete(id);
        if (response.status === 'success') {
            showAlert('Reserva eliminada', 'success');
            await loadAllReservations();
            // Si hay búsqueda activa, recargarla también
            const searchUserId = document.getElementById('searchUserId').value.trim();
            if (searchUserId) {
                await handleSearchByUser();
            }
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar reserva', 'error');
    }
};

const handleSubmitReservation = async (e) => {
    e.preventDefault();
    const reservationData = {
        user_id: parseInt(document.getElementById('userId').value),
        flight_id: parseInt(document.getElementById('flightId').value)
    };
    try {
        const response = await reservations.create(reservationData);
        if (response.status === 'success') {
            showAlert('Reserva creada exitosamente', 'success');
            closeForm();
            await loadAllReservations();
            // Si hay búsqueda activa, recargarla también
            const searchUserId = document.getElementById('searchUserId').value.trim();
            if (searchUserId && searchUserId === reservationData.user_id.toString()) {
                await handleSearchByUser();
            }
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al crear reserva', 'error');
    }
};

const closeForm = () => {
    document.getElementById('reservationformcreate').style.display = 'none';
    document.getElementById('reservationForm').reset();
};