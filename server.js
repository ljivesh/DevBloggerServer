const express = require('express');
const db = require('./db').default;
const configs = require('./configs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const userRoute = require('./routes/userRoutes');
app.use('/api/user/', userRoute);


app.get('/', (req, res)=> res.send("Server Running"));

const port = configs.serverPort || 3000;
app.listen(port, ()=> console.log(`Server Started on port ${port}`));