
const chatForm = document.getElementById('chat-form');
const chatContainer = document.querySelector('.chat-container');
const roomName = document.getElementById('room-name');
const activeUsers = document.getElementById('active-users');


const { userName, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();
socket.emit('joinRoom', { userName, room });

socket.on('activeUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', (message, chatPosition) => {
    outputMessage(message, chatPosition);
    chatContainer.scrollTop = chatContainer.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    msg = msg.trim();

    if (!msg) {
        return false;
    }

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputUsers(users) {
    activeUsers.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.classList.add('person');
        const div = document.createElement('div');
        div.classList.add('user');
        const img = document.createElement('img');
        img.src = '../img/default.png';
        const span = document.createElement('span');
        span.classList.add('status');
        span.classList.add('online');
        div.appendChild(img);
        div.appendChild(span);
        const name = document.createElement('span')
        name.innerText = user.userName;
        li.appendChild(div);
        li.appendChild(name);
        activeUsers.appendChild(li);
    });
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputMessage (message, chatPosition) {
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('chat-avatar');
    const dp = document.createElement('img');
    dp.src = '../img/default.png';
    const name = document.createElement('div');
    name.classList.add('chat-name');
    name.innerText = message.userName;
    avatarDiv.appendChild(dp);
    avatarDiv.appendChild(name);
    const text = document.createElement('div');
    text.classList.add('chat-text');
    text.innerText = message.text;
    const time = document.createElement('div');
    time.classList.add('chat-hour');
    time.innerHTML = `${message.time} <span class="fa fa-check-circle"></span>`;

    const ul = document.querySelector('.chat-box');
    const li = document.createElement('li');
    if (!chatPosition) {
        if (message.userName === userName) {
            chatPosition = 'chat-right';
        } else {
            chatPosition = 'chat-left';
        }
    }

    if (chatPosition === 'chat-left') {
        li.classList.add(chatPosition);
        li.appendChild(avatarDiv);
        li.appendChild(text);
        li.appendChild(time);
        ul.appendChild(li);
    } else {
        li.classList.add(chatPosition);
        li.appendChild(time);
        li.appendChild(text);
        li.appendChild(avatarDiv);
        ul.appendChild(li);
    }
    
}


document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm("Are you sure you want to leave the room?");
    if (leaveRoom) {
        window.location = '../index.html';
    }
});
