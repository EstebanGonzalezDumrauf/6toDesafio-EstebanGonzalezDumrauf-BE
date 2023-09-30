const socket = io(); 
let user;
let chatBox = document.getElementById('chatBox');

const { value: email } = Swal.fire({
    title: 'Identificate',
    input: 'email',
    inputLabel: 'Ingresa tu e-mail para Identificarte',
    inputPlaceholder: 'Direccion de Email'
}).then(result => {
    user = result.value
    socket.emit('authenticated', user);
})


chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})

socket.on('messageLogs', data =>{
    let log = document.getElementById('messageLogs');
    let messages = "";

    data.forEach(message => {
        messages = messages + `${message.user} dice ${message.message} </br>` ;
    });
    log.innerHTML = messages;
})

socket.on('newUserConnected', user =>{
    if (!user) return;
    Swal.fire({
        toast: true,
        position: "top-right",
        text: "Nuevo Usuario Conectado",
        title: `${user} se ha unido al chat`
    })
})