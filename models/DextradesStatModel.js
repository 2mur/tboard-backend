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

export const DextradesStatSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    window: {
        type: Number,
        required: true,
    },
    trader_type: {
        type: String,
        required: true,
    },
    uc: {
        type: Number,
        required: true,
    },
    tc: {
        type: Number,
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