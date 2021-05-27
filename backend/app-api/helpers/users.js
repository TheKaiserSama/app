let connectedUsers = {};

function getAllConnectedUsers() {
    return connectedUsers;
}

function addSocket(propName, idSocket) {
    connectedUsers[propName] = idSocket;
    return connectedUsers[propName];
}

function deleteSocket(idSocket) {
    let nameProp = '';
    for (let key in connectedUsers) {
        if (connectedUsers[key] == idSocket) {
            nameProp = key;
            break;
        }
    }
    delete connectedUsers[nameProp];
}

module.exports = {
    getAllConnectedUsers,
    addSocket,
    deleteSocket
};