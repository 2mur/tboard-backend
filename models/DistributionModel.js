import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/*
_id 683fd80706d57366caab2778
rank 1
day "2025-06-04"
token "COQ"
bin "[0-100)"
buy_count 39
sell_count 34
buy_bin_volume 544.55
sell_bin_volume 589.32
*/

export const DistributionSchema = new Schema({
    rank: {
        type: Number,
        required: true,
    },
    day: {
        type: Date,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    bin: {
        type: String,
        required: true,
    },
    buy_count: {
        type: Number,
        required: true,
    },
    sell_count: {
        type: Number,
        required: true,
    },
    buy_bin_volume: {
        type: Number,
        required: true,
    },
    sell_bin_volume: {
        type: Number,
        required: true,
    },
} );