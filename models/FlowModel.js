import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/*
{
  "_id": "683f...",
  "day": "2025-06-03",
  "token": "NOCHILL",
  "dex": "trader_joe-v1",
  "pool": "NOCHILL-WAVAX",
  "positive_flow": 10044.23,
  "negative_flow": -0.5,
  "netflow": 10043.73,
  "volume": 10044.72
}
*/

export const FlowSchema = new Schema({
    token:{
        type: String,
        required: true,
    },
    day: {
        type: Date,
        required: true,
    },
    positive_flow: {
        type: Number,
        required: true,
    }, 
    negative_flow: {
        type: Number,
        required: true,
    }, 
    netflow: {
        type: Number,
        required: true,
    },
    volume: {
        type: Number,
        required: true,
    },
    pool: {
        type: String,
        required: true,
    },
    dex: {
        type: String,
        required: true,
    },
} );
