// hub for models and db connection
const mongoose = require('mongoose');


require("dotenv").config();
const connectionString = "mongodb+srv://keyahnajanae:Rainbows@cluster0.hmdsq.mongodb.net/restaurants-db?retryWrites=true&w=majority" ||
    process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurants-db';

    mongoose.set('useCreateIndex', true);

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${connectionString}`);
})

mongoose.connection.on('disconnected', (event) => {
    console.log('Mongoose is disconnected', event);
})

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose error: ${err}`);
})

module.exports = {
    Restaurant: require('./Restaurant.js'),
    Review: require('./Review.js'),
    User: require("./User")
}
