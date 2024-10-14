const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoute');
const verifyToken = require('./middlewares/verifyToken');
const groupRoute = require('./routes/groupRoute');
const homeRoute = require('./routes/homeRoute');
const taskRoute = require('./routes/taskRoute');
const defaultTagRoute = require('./routes/defaultTagRoute');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Configuration de Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`Client joined group: ${groupId}`);
});

socket.on('disconnect', () => {
    console.log('Client disconnected');
});
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', verifyToken, homeRoute);
app.use('/api/group', groupRoute);
app.use('/api/defaultTags', defaultTagRoute);
app.use('/api/task', taskRoute(io));  // Passez l'instance io au routeur des tâches

// hello world
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const linkConsole = `http://localhost:${port}`;

sequelize.sync().then(() => {
    console.log(`Connected to database ${linkConsole}`);
    server.listen(port, () => {
        console.log(`Server is running on port ${linkConsole}`);
    });
});