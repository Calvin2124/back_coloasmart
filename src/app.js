const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const verifyToken = require('./middlewares/verifyToken');
const groupRoute = require('./routes/groupRoute');
const homeRoute = require('./routes/homeRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', verifyToken, homeRoute);
app.use('/api/group', groupRoute);

// hello world
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const linkConsole = `http://localhost:${port}`;

sequelize.sync().then(() => {
    console.log(`Connected to database ${linkConsole}`);
    app.listen(port, () => {
        console.log(`Server is running on port ${linkConsole}`);
    });
});