const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const droneSchema = new Schema({
    serial: {
        type: String,
        required: true
    },
    battery: {
        type: Number,
        required: true
    },
    location: {
        type: Object,
        require: true
    },
    takeOffStatus: {
        type: Boolean,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    move: {
        type: String,
    },
    area: [
        {
            lat: { type: Number, required: true },
            lon: { type: Number, required: true }
        }
    ],
    errors: [
        {
            errorId: { type: Schema.Types.ObjectId, ref: 'ErrorList', required: true }
        }
    ]
},{ supressReservedKeysWarning: true })


module.exports = mongoose.model('Drone', droneSchema)
