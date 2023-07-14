const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    userName: {type: String, required: true},
    iat: {type: Number, required: true},

}, {
    statics: {
        async findAllByUser(userName) {
            const users = await this.find({userName: userName}).exec();
            return users; 
        },
        async findSession(userName, iat) {
            const user = await this.findOne({userName: userName, iat: iat}).exec();
            return user;
        },
        async deleteSession(userName, iat) {
            await this.findOneAndRemove({userName: userName, iat: iat}).exec();
        },
    }
}
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;