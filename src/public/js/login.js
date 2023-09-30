const form = document.getElementById('loginForm');

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const userField = document.getElementById('email');

    form.addEventListener('submit', function (event) {
        if (!validateEmail(userField.value)) {
            event.preventDefault();
            alert('Por favor, ingrese una dirección de correo electrónico válida.');
        }
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        console.log(result.status); 
        if (result.status === 200) {
            window.location.href = '/products'; //window.location.replace('/products')
        } 
        
        if (result.status === 400) {
            const msjErrorLabel = document.getElementById('msjError');
            msjErrorLabel.textContent = "Usuario no existe o password incorrecto.";
        }

        if (result.status === 401) {
            const msjErrorLabel = document.getElementById('msjError');
            msjErrorLabel.textContent = "Credenciales Inválidas";
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
})
    
    //.then(result => result.json()).then(json => console.log(json))
//})