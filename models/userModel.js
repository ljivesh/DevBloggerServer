const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},

}, {
    timestamps: true,
    statics: {
        async findByUser(userName) {
            const user = await this.findOne({userName: userName}).exec();
            return user; 
        },
        async findByEmail(email) {
            const user = await this.findOne({email: email}).exec();
            return user;
        }
    }
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;