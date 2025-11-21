// Mostrar mensaje de alerta
const showAlert = (message, type = 'info') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
};

// Formatear fecha
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Formatear precio
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(price);
};

// Confirmar acción
const confirmAction = (message) => {
    return confirm(message);
};

// Mostrar/ocultar loading
const toggleLoading = (show) => {
    let loader = document.getElementById('loader');
    
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.className = 'loader';
        loader.textContent = 'Cargando...';
        document.body.appendChild(loader);
    }
    
    loader.style.display = show ? 'block' : 'none';
};

// Limpiar formulario
const clearForm = (formId) => {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
};

// Validar email
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};