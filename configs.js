const dotenv = require('dotenv');
dotenv.config();

const configs = {
    serverPort: process.env.PORT,
    mongoURI: process.env.MONGOURI,
}

module.exports = configs;