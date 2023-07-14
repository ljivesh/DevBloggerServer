const express = require('express');
const db = require('./db').default;
const configs = require('./configs');

const app = express();
app.use(express.json());

const userRoute = require('./routes/userRoutes');
app.use('/api/user/', userRoute);


const port = configs.serverPort || 3000;
app.listen(port, ()=> console.log(`Server Started on port ${port}`));