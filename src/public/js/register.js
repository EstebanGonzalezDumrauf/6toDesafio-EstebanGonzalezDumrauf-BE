const form = document.getElementById('registerForm');

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
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
    fetch('api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        console.log(result.status); 
        if (result.status === 200) {
            window.location.href = '/';
        } 
        
        if (result.status === 400) {
            // Usuario ya registrado
            const msjErrorLabel = document.getElementById('msjErrorRegistro');
            msjErrorLabel.textContent = "Error al registrarse. Ya existe un usuario con ese e-mail.";
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
});
    
    
    //.then(result => result.json()).then(json => console.log(json))
//})