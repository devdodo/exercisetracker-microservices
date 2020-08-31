const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    __v:false,
    username: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    log: [
        {   _id:false,
            description: {
                type: String,
                required: true
            },
            duration: {
                type: String,
                required: true
            },
            date: {
                type: Date
            }   
        }
    ]
    
});

module.exports = mongoose.model('Exercise', ExerciseSchema);