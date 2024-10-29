const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    password: String,
    userId: String,
    email: String,
    phone: Number,
    verificationCode: String,
  verificationCodeExpires: Date,
});

const User = mongoose.model('User' , UserSchema);

module.exports = User;