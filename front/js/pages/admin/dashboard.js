document.addEventListener('DOMContentLoaded', async () => {
    // Validar sesión
    const isValid = await validateSession();
    if (!isValid) return;
    // Verificar rol de administrador
    requireRole(['administrador']);
    // Mostrar información del usuario
    const user = getCurrentUser();
    document.getElementById('userInfo').innerHTML = `
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>
        <p><span class="badge">${user.role}</span></p>
    `;
    // Cargar estadísticas
    await loadStats();
    // Evento logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Estás seguro de cerrar sesión?')) {
            await handleLogout();
        }
    });
});
// Cargar estadísticas
const loadStats = async () => {
    try {
        toggleLoading(true);
        // Obtener datos de todas las entidades
        const [usersRes, navesRes, flightsRes, reservationsRes] = await Promise.all([
            usersAPI.getAll(),
            navesAPI.getAll(),
            flightsAPI.getAll(),
            reservationsAPI.getAll()
        ]);
        // Actualizar contadores
        document.getElementById('totalUsers').textContent = usersRes.data ? usersRes.data.length : 0;
        document.getElementById('totalNaves').textContent = navesRes.data ? navesRes.data.length : 0;
        document.getElementById('totalFlights').textContent = flightsRes.data ? flightsRes.data.length : 0;
        document.getElementById('totalReservations').textContent = reservationsRes.data ? reservationsRes.data.length : 0;
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        showAlert('Error al cargar estadísticas', 'error');
    } finally {
        toggleLoading(false);
    }
};