const mongoose = require('mongoose');
const configs = require('./configs');


const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

mongoose.connect(configs.mongoURI, options);

const db = mongoose.connection;


db.on('connected', ()=> {

    console.log('Connection to MongoDB success');

});

db.on('error', ()=> {

    console.log('Connection to MongoDB failed');

});

module.exports = mongoose;