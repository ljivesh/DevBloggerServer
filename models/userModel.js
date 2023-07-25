const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
        },
        async updatePassword(userName, password) {
            await this.findOneAndUpdate({userName: userName}, {password: password});
        }
    }
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;