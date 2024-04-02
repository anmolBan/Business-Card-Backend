const mongoose = require('mongoose');
const { connectionString } = require('./dbConnectionString');

mongoose.connect(connectionString);

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const CardSchema = new mongoose.Schema({
    name: String,
    description: String,
    interests: {
        type: [String]
    },
    linkedin: String,
    github: String
});

const Admin = mongoose.model('Admin', AdminSchema);
const Card = mongoose.model('Card', CardSchema);

module.exports = {
    Admin: Admin,
    Card: Card
}
