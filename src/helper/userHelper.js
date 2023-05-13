const users = [];


function newUser (id, userName, room) {
    const user = {
        id,
        userName,
        room
    };

    users.push(user);
    return user;
}

function getActiveUsers (room) {
    return users.filter(user => user.room === room);
}

function leaveRoom (id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

module.exports = {
    getCurrentUser,
    getActiveUsers,
    leaveRoom,
    newUser
}
