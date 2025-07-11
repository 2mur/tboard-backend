import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/*
user,
t_in,
t_out,
v_in,
v_out,
iot,
iov,
trade_count,
token,
rank,
board,
window
*/

export const LeaderboardSchema = new Schema({
    rank: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    board: {
        type: String,
        required: true,
    },
    t_in: {
        type: Number,
        required: true,
    },
    t_out: {
        type: Number,
        required: true,
    },
    v_in: {
        type: Number,
        required: true,
    },
    v_out: {
        type: Number,
        required: true,
    },
    iot: {
        type: Number,
        required: true,
    },
    iov: {
        type: Number,
        required: true,
    }
} );