const http = require('http');

const server = http.createServer();

const io = require('socket.io')(server, {
    cors: {
        origin: 'https://chatealo-simple.netlify.app', // El dominio de tu frontend
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    },
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    // Escuchar cuando un nuevo usuario se conecta y enviar un mensaje de notificación
    socket.on('usuario_conectado', (nombreUsuario) => {
        socket.broadcast.emit('chat_message', {
            usuario: 'INFO',
            mensaje: `${nombreUsuario} se conectó al chat`
        });
    });
    // Escuchar cuando se recibe un mensaje de chat
    socket.on('chat_message', (data) => {
        console.log(data);
        io.emit('chat_message', data);
    });

    // Escuchar cuando un usuario está escribiendo
    socket.on('typing', (usuario) => {
        socket.broadcast.emit('typing', usuario);
    });

    // Escuchar cuando un usuario deja de escribir
    socket.on('stop_typing', () => {
        socket.broadcast.emit('stop_typing');
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
