let editingNaveId = null;
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
    // Cargar naves
    await loadNaves();
    // Eventos
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Cerrar sesión?')) await handleLogout();
    });
    document.getElementById('btnNewNave').addEventListener('click', openNewNaveModal);
    document.getElementById('btnCancelNave').addEventListener('click', closeModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('naveForm').addEventListener('submit', handleSubmitNave);
});
// Cargar naves
const loadNaves = async () => {
    try {
        toggleLoading(true);
        const response = await navesAPI.getAll();
        const tbody = document.getElementById('navesTableBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(nave => `
                <tr>
                    <td>${nave.id}</td>
                    <td>${nave.name}</td>
                    <td>${nave.model}</td>
                    <td>${nave.capacity}</td>
                    <td class="table-actions">
                        <button class="btn btn-warning btn-sm" onclick="editNave(${nave.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteNave(${nave.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay naves registradas</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar naves', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Abrir modal nueva nave
const openNewNaveModal = () => {
    editingNaveId = null;
    document.getElementById('modalTitle').textContent = 'Nueva Nave';
    document.getElementById('naveForm').reset();
    document.getElementById('naveId').value = '';
    document.getElementById('naveModal').style.display = 'flex';
};
// Editar nave
const editNave = async (id) => {
    try {
        toggleLoading(true);
        const response = await navesAPI.getById(id);
        if (response.status === 'success' && response.data) {
            editingNaveId = id;
            document.getElementById('modalTitle').textContent = 'Editar Nave';
            document.getElementById('naveId').value = response.data.id;
            document.getElementById('naveName').value = response.data.name;
            document.getElementById('naveModel').value = response.data.model;
            document.getElementById('naveCapacity').value = response.data.capacity;
            document.getElementById('naveModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar nave', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Eliminar nave
const deleteNave = async (id) => {
    if (!confirmAction('¿Eliminar esta nave?')) return;
    try {
        toggleLoading(true);
        const response = await navesAPI.delete(id);
        if (response.status === 'success') {
            showAlert('Nave eliminada', 'success');
            await loadNaves();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar nave', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Manejar submit del formulario
const handleSubmitNave = async (e) => {
    e.preventDefault();
    const naveData = {
        name: document.getElementById('naveName').value.trim(),
        model: document.getElementById('naveModel').value.trim(),
        capacity: parseInt(document.getElementById('naveCapacity').value)
    };
    try {
        toggleLoading(true);
        let response;

        if (editingNaveId) {
            response = await navesAPI.update(editingNaveId, naveData);
        } else {
            response = await navesAPI.create(naveData);
        }
        if (response.status === 'success') {
            showAlert(editingNaveId ? 'Nave actualizada' : 'Nave creada', 'success');
            closeModal();
            await loadNaves();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar nave', 'error');
    } finally {
        toggleLoading(false);
    }
};
// Cerrar modal
const closeModal = () => {
    document.getElementById('naveModal').style.display = 'none';
    document.getElementById('naveForm').reset();
    editingNaveId = null;
};