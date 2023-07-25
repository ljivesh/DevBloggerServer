
const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, required: true, unique:true},
    contact: {type: String},
    dob: {type: Date},
    userName: {type: String, required: true, unique: true}
}, {
    timestamps: true,
    statics: {
        async getUserProfile(userName) {
            const profile = await this.findOne({userName: userName}).exec();
            return profile;
        },
        async updateProfile(userName, profileData) {

            const qurey = await this.findOneAndUpdate({userName: userName}, profileData);
            const profile = await this.findOne({userName: userName});
        }
    }

});


const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;


