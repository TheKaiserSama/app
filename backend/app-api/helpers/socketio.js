const socketIO = require('socket.io');
const EstudianteDao = require('../../app-core/dao/EstudianteDao');
const NotificacionDao = require('../../app-core/dao/NotificacionDao');
const { getAllConnectedUsers, addSocket, deleteSocket } = require('./users');

module.exports.listen = function (server) {

    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        
        socket.on('saveSocket', async (persona) => {
            const infoEstudiante = await EstudianteDao.findEstudiantePorPersona(persona.id);
            if (!infoEstudiante) return;
            const userSocket = addSocket(infoEstudiante.id, socket.id);

            const notificaciones = await NotificacionDao.findUltimasNotificaciones(infoEstudiante.id);

            if (userSocket) {
                io.to(userSocket).emit('privateNotificacion', notificaciones);
            }

            console.log('Todos los usuarios conectados', getAllConnectedUsers());
        });

        socket.on('sendNotificacion', async (notas) => {
            if (!notas) return;
            Promise.all(notas.map(async (nota) => {
                const notificaciones = await NotificacionDao.findUltimasNotificaciones(nota.id_estudiante);
                
                const userSocket = getAllConnectedUsers()[nota.id_estudiante.toString()];
                if (userSocket) {
                    io.to(userSocket).emit('privateNotificacion', notificaciones);
                }
            }));
        });

        // socket.on('getUltimasNotificaciones', async (estudiantes) => {
        //     console.log('________________________', estudiantes);
        // });

        socket.on('disconnect', () => {
            console.log('User disconnected');
            deleteSocket(socket.id);
        });
    });

};