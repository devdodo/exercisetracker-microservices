const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/keys').MONGO_URI;

const app = express();

// MongoDB Connection
const mongoConnect = async () => {
    try {
        await mongoose.connect(db, 
            {   useNewUrlParser: true, 
                useUnifiedTopology: true, 
                useFindAndModify: false 
            });
        console.log('MongoDB connected successfully');            
    } catch (err) {
        console.error(err)
    }
}

mongoConnect();

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', require('./routes/api/exercise'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on Port: ${PORT}`))