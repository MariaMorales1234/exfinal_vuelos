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
    `;
    // Cargar usuarios
    await loadUsers();
    // Eventos
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Cerrar sesión?')) await handleLogout();
    });
    document.getElementById('btnNewUser').addEventListener('click', openNewUserForm);
    document.getElementById('btnCancelUser').addEventListener('click', closeForm);
    document.querySelector('.close').addEventListener('click', closeForm);
    document.getElementById('userForm').addEventListener('submit', handleSubmitUser);
});
// Cargar usuarios
const loadUsers = async () => {
    try {
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
                        <button class="btn-sm" onclick="editUser(${user.id})">Editar</button>
                        <button class="btn-sm" onclick="deleteUser(${user.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay usuarios</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar usuarios', 'error');
    }
};
// Abrir modal nuevo usuario
const openNewUserForm = () => {
    editingUserId = null;
    document.getElementById('formTitle').textContent = 'Nuevo Usuario';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userPassword').required = true;
    document.getElementById('userformcreate').style.display = 'flex';
};
// Editar usuario
const editUser = async (id) => {
    try {
        const response = await usersAPI.getById(id);
        if (response.status === 'success' && response.data) {
            editingUserId = id;
            document.getElementById('formTitle').textContent = 'Editar Usuario';
            document.getElementById('userId').value = response.data.id;
            document.getElementById('userName').value = response.data.name;
            document.getElementById('userEmail').value = response.data.email;
            document.getElementById('userRole').value = response.data.role;
            document.getElementById('userPassword').value = '';
            document.getElementById('userPassword').required = false;
            document.getElementById('userformcreate').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar usuario', 'error');
    }
};
// Eliminar usuario
const deleteUser = async (id) => {
    if (!confirmAction('¿Eliminar este usuario?')) return;
    try {
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
        let response;
        if (editingUserId) {
            response = await usersAPI.update(editingUserId, userData);
        } else {
            if (!password) {
                showAlert('La contraseña es requerida', 'error');
                return;
            }
            response = await usersAPI.create(userData);
        }
        if (response.status === 'success') {
            showAlert(editingUserId ? 'Usuario actualizado' : 'Usuario creado', 'success');
            closeForm();
            await loadUsers();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar usuario', 'error');
    }
};
// Cerrar modal
const closeForm = () => {
    document.getElementById('userformcreate').style.display = 'none';
    document.getElementById('userForm').reset();
    editingUserId = null;
};