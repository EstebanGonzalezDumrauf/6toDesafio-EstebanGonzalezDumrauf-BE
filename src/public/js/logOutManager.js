const form = document.getElementById('log-out-session-Form');

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/logout', { 
        method: 'POST', 
        body: JSON.stringify(obj),
        headers: {
            'Content-type':'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.href = '/';
        } else {
            console.log('Inicio de sesión fallido');
        }
    }).catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
})
