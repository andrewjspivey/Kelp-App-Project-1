// hub for models and db connection
const mongoose = require('mongoose');


require("dotenv").config();
const connectionString = "mongodb://keyahnajanae:Rainbows@cluster0-shard-00-00.hmdsq.mongodb.net:27017,cluster0-shard-00-01.hmdsq.mongodb.net:27017,cluster0-shard-00-02.hmdsq.mongodb.net:27017/restaurants-db?ssl=true&replicaSet=atlas-hu1jry-shard-0&authSource=admin&retryWrites=true&w=majority" ||
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
