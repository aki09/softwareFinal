const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    arrayDist:{
        type:Number
    },
    drones: [
        {
            droneId: { type: Schema.Types.ObjectId, ref: 'Drone', required: true }
        }
    ]
});

module.exports = mongoose.model('User', userSchema)