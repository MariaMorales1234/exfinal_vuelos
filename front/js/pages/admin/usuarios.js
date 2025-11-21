let editingUserId = null;
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
    // Cargar usuarios
    await loadUsers();
    // Eventos
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Cerrar sesión?')) await handleLogout();
    });
    document.getElementById('btnNewUser').addEventListener('click', openNewUserModal);
    document.getElementById('btnCancelUser').addEventListener('click', closeModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('userForm').addEventListener('submit', handleSubmitUser);
});
// Cargar usuarios
const loadUsers = async () => {
    try {
        toggleLoading(true);
        const response = await usersAPI.getAll();
        const tbody = document.getElementById('usersTableBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="badge badge-${user.role}">${user.role}</span></td>
                    <td class="table-actions">
                        <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay usuarios</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar usuarios', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Abrir modal nuevo usuario
const openNewUserModal = () => {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userPassword').required = true;
    document.getElementById('passwordHelper').style.display = 'none';
    document.getElementById('userModal').style.display = 'flex';
};
// Editar usuario
const editUser = async (id) => {
    try {
        toggleLoading(true);
        const response = await usersAPI.getById(id);
        if (response.status === 'success' && response.data) {
            editingUserId = id;
            document.getElementById('modalTitle').textContent = 'Editar Usuario';
            document.getElementById('userId').value = response.data.id;
            document.getElementById('userName').value = response.data.name;
            document.getElementById('userEmail').value = response.data.email;
            document.getElementById('userRole').value = response.data.role;
            document.getElementById('userPassword').value = '';
            document.getElementById('userPassword').required = false;
            document.getElementById('passwordHelper').style.display = 'block';
            document.getElementById('userModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar usuario', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Eliminar usuario
const deleteUser = async (id) => {
    if (!confirmAction('¿Eliminar este usuario?')) return;
    try {
        toggleLoading(true);
        const response = await usersAPI.delete(id);
        if (response.status === 'success') {
            showAlert('Usuario eliminado', 'success');
            await loadUsers();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar usuario', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Manejar submit del formulario
const handleSubmitUser = async (e) => {
    e.preventDefault();
    const userData = {
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        role: document.getElementById('userRole').value
    };
    const password = document.getElementById('userPassword').value.trim();
    if (password) {
        userData.password = password;
    }
    try {
        toggleLoading(true);
        let response;
        if (editingUserId) {
            response = await usersAPI.update(editingUserId, userData);
        } else {
            if (!password) {
                showAlert('La contraseña es requerida', 'error');
                toggleLoading(false);
                return;
            }
            response = await usersAPI.create(userData);
        }
        if (response.status === 'success') {
            showAlert(editingUserId ? 'Usuario actualizado' : 'Usuario creado', 'success');
            closeModal();
            await loadUsers();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar usuario', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Cerrar modal
const closeModal = () => {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
    editingUserId = null;
};