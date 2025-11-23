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
    // Evento logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Estás seguro de cerrar sesión?')) {
            await handleLogout();
        }
    });
});
