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