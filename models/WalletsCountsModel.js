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
trader_type,
sold_perc,
rank,
board
*/

export const WalletsCountsSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    window: {
        type: Number,
        required: true,
    },
    all: {
        type: Number,
        required: true,
    },
    old: {
        type: Number,
        required: true,
    },
    new: {
        type: Number,
        required: true,
    },
    abs: {
        type: Number,
        required: true,
    }
} );