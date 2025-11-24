document.addEventListener('DOMContentLoaded', async () => {
    const isValid = await validateSession();
    if (!isValid) return;
    requireRole(['administrador']);
    const user = getCurrentUser();
    document.getElementById('userInfo').innerHTML = `
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>
    `;
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Estás seguro de cerrar sesión?')) {
            await handleLogout();
        }
    });
});