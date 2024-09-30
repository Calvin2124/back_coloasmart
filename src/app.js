const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Hello world 
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const linkConsole = `http://localhost:${port}`;

app.listen(port, () => {
    console.log(`Server is running on port ${linkConsole}`);
});