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

// Configurer CORS pour Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // Remplacez par l'URL de votre frontend
        methods: ["GET", "POST"], // Méthodes autorisées
        credentials: true, // Autoriser les cookies et les authentifications
    }
});
const port = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration de CORS pour les requêtes HTTP normales
const corsOptions = {
    origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));

// Configuration de Socket.IO
io.on('connection', (socket) => {
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

// Hello world
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Synchronisation de la base de données et démarrage du serveur
const linkConsole = `http://localhost:${port}`;

sequelize.sync().then(() => {
    console.log(`Connected to database ${linkConsole}`);
    server.listen(port, () => {
        console.log(`Server is running on port ${linkConsole}`);
    });
});