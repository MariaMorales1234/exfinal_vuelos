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
    // Cargar reservas del usuario
    await loadMyReservations();
    // Eventos
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Cerrar sesión?')) await handleLogout();
    });
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    document.getElementById('btnSearchByUser').addEventListener('click', handleSearchByUser);
});
// Cambiar tab
const switchTab = async (tabName) => {
    // Ocultar todos los contenidos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    // Desactivar todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Activar tab seleccionado
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    // Cargar datos según el tab
    if (tabName === 'my-reservations') {
        await loadMyReservations();
    } else if (tabName === 'by-user') {
        // Limpiar la búsqueda anterior
        document.getElementById('searchUserId').value = '';
        document.getElementById('userReservationsBody').innerHTML = '<tr><td colspan="7" style="text-align: center;">Ingrese un ID de usuario para buscar</td></tr>';
    }
};
// Cargar mis reservas
const loadMyReservations = async () => {
    try {
        toggleLoading(true);
        const response = await reservationsAPI.getByUser(currentUser.id);
        const tbody = document.getElementById('myReservationsBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(reservation => `
                <tr>
                    <td>${reservation.id}</td>
                    <td>#${reservation.flight_id}</td>
                    <td>${reservation.flight ? reservation.flight.origin : 'N/A'}</td>
                    <td>${reservation.flight ? reservation.flight.destination : 'N/A'}</td>
                    <td>${reservation.flight ? formatDate(reservation.flight.departure) : 'N/A'}</td>
                    <td><span class="badge badge-${reservation.status}">${reservation.status}</span></td>
                    <td class="table-actions">
                        ${reservation.status === 'activa' ? 
                            `<button class="btn btn-warning btn-sm" onclick="cancelReservation(${reservation.id})">Cancelar</button>` : 
                            '<span style="color: #95a5a6;">Cancelada</span>'}
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No tienes reservas</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar reservas', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Buscar reservas por usuario
const handleSearchByUser = async () => {
    const userId = document.getElementById('searchUserId').value.trim();
    if (!userId) {
        showAlert('Ingrese un ID de usuario', 'error');
        return;
    }
    try {
        toggleLoading(true);
        const response = await reservationsAPI.getByUser(userId);
        const tbody = document.getElementById('userReservationsBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(reservation => `
                <tr>
                    <td>${reservation.id}</td>
                    <td>#${reservation.flight_id}</td>
                    <td>${reservation.flight ? reservation.flight.origin : 'N/A'}</td>
                    <td>${reservation.flight ? reservation.flight.destination : 'N/A'}</td>
                    <td>${reservation.flight ? formatDate(reservation.flight.departure) : 'N/A'}</td>
                    <td><span class="badge badge-${reservation.status}">${reservation.status}</span></td>
                    <td class="table-actions">
                        ${reservation.status === 'activa' ? 
                            `<button class="btn btn-warning btn-sm" onclick="cancelReservation(${reservation.id})">Cancelar</button>` : 
                            '<span style="color: #95a5a6;">Cancelada</span>'}
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Este usuario no tiene reservas</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al buscar reservas', 'error');
        document.getElementById('userReservationsBody').innerHTML = '<tr><td colspan="7" style="text-align: center;">Error al buscar reservas</td></tr>';
    } finally {
        toggleLoading(false);
    }
};
// Cancelar reserva
const cancelReservation = async (id) => {
    if (!confirmAction('¿Cancelar esta reserva?')) return;
    try {
        toggleLoading(true);
        const response = await reservationsAPI.cancel(id);
        if (response.status === 'success') {
            showAlert('Reserva cancelada exitosamente', 'success');
            // Recargar la tabla actual
            const activeTab = document.querySelector('.tab-content.active').id;
            if (activeTab === 'my-reservations') {
                await loadMyReservations();
            } else if (activeTab === 'by-user') {
                // Recargar la búsqueda actual
                const userId = document.getElementById('searchUserId').value.trim();
                if (userId) {
                    await handleSearchByUser();
                }
            }
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cancelar reserva', 'error');
    } finally {
        toggleLoading(false);
    }
};