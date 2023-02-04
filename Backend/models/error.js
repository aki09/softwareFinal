const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const errorSchema = new Schema({
    droneId: {
        type: Schema.Types.ObjectId,
        ref: 'Drone',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    folder: {
        type: String,
        required: true
    },
    timestamps: {
        type: Date,
        required: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{ supressReservedKeysWarning: true })

module.exports = mongoose.model('ErrorList', errorSchema)