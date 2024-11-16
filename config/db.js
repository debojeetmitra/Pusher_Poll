const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;
//Mongoose Connect
mongoose.connect
('mongodb+srv://user1:Fluores%232215@cluster0.hxnac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));