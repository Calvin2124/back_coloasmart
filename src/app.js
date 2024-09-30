const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//Routes
app.use('/api/auth', authRoutes);

const linkConsole = `http://localhost:${port}`;

sequelize.sync().then(() => {
    console.log(`Connected to database ${linkConsole}`);
    app.listen(port, () => {
        console.log(`Server is running on port ${linkConsole}`);
    });
});