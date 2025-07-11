import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/*
*/

export const UserGraphSchema = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    tx_count: {
        type: Number,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
} );