let editingNaveId = null;
document.addEventListener('DOMContentLoaded', async () => {
    const isValid = await validateSession();
    if (!isValid) return;
    requireRole(['administrador']);
    const user = getCurrentUser();
    document.getElementById('userInfo').innerHTML = `
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>
        <p><span class="badge">${user.role}</span></p>
    `;
    await loadNaves();
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirmAction('¿Cerrar sesión?')) await handleLogout();
    });
    document.getElementById('btnNewNave').addEventListener('click', openNewNaveForm);
    document.getElementById('btnCancelNave').addEventListener('click', closeForm);
    document.querySelector('.close').addEventListener('click', closeForm);
    document.getElementById('naveForm').addEventListener('submit', handleSubmitNave);
});

const loadNaves = async () => {
    try {
        const response = await naves.getAll();
        const tbody = document.getElementById('navesTableBody');
        if (response.status === 'success' && response.data && response.data.length > 0) {
            tbody.innerHTML = response.data.map(nave => `
                <tr>
                    <td>${nave.id}</td>
                    <td>${nave.name}</td>
                    <td>${nave.model}</td>
                    <td>${nave.capacity}</td>
                    <td class="table-actions">
                        <button class="btn-sm" onclick="editNave(${nave.id})">Editar</button>
                        <button class="btn-sm" onclick="deleteNave(${nave.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay naves registradas</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar naves', 'error');
    }
};

const openNewNaveForm = () => {
    editingNaveId = null;
    document.getElementById('formTitle').textContent = 'Nueva Nave';
    document.getElementById('naveForm').reset();
    document.getElementById('naveId').value = '';
    document.getElementById('naveformcreate').style.display = 'flex';
};

const editNave = async (id) => {
    try {
        const response = await naves.getById(id);
        if (response.status === 'success' && response.data) {
            editingNaveId = id;
            document.getElementById('formTitle').textContent = 'Editar Nave';
            document.getElementById('naveId').value = response.data.id;
            document.getElementById('naveName').value = response.data.name;
            document.getElementById('naveModel').value = response.data.model;
            document.getElementById('naveCapacity').value = response.data.capacity;
            document.getElementById('naveformcreate').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar nave', 'error');
    }
};

const deleteNave = async (id) => {
    if (!confirmAction('¿Eliminar esta nave?')) return;
    try {
        const response = await naves.delete(id);
        if (response.status === 'success') {
            showAlert('Nave eliminada', 'success');
            await loadNaves();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar nave', 'error');
    }
};

const handleSubmitNave = async (e) => {
    e.preventDefault();
    const naveData = {
        name: document.getElementById('naveName').value.trim(),
        model: document.getElementById('naveModel').value.trim(),
        capacity: parseInt(document.getElementById('naveCapacity').value)
    };
    try {
        let response;
        if (editingNaveId) {
            response = await naves.update(editingNaveId, naveData);
        } else {
            response = await naves.create(naveData);
        }
        if (response.status === 'success') {
            showAlert(editingNaveId ? 'Nave actualizada' : 'Nave creada', 'success');
            closeForm();
            await loadNaves();
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar nave', 'error');
    }
};

const closeForm = () => {
    document.getElementById('naveformcreate').style.display = 'none';
    document.getElementById('naveForm').reset();
    editingNaveId = null;
};