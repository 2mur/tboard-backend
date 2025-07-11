import mongoose from 'mongoose';
import {FlowSchema} from '../models/FlowModel.js';
import {DistributionSchema} from '../models/DistributionModel.js';
import {UserGraphSchema} from '../models/UserGraphModel.js';
import {LeaderboardSchema} from '../models/LeaderboardModel.js';
import {DextradesStatSchema} from '../models/DextradesStatModel.js';
import {WalletsCountsSchema} from '../models/WalletsCountsModel.js';


const getDistribution = async (req, res) => {
    try {
        const { id, numdays } = req.params;
        const modelDistribution = mongoose.model('bins', DistributionSchema, 'bins')
        
        
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - numdays);
        console.log()
        //const timerange = daysAgo.toISOString().split('T')[0];
        const data = await modelDistribution.aggregate([// Step 1: Filter by token AND by date
                                                                {
                                                                    '$match': {
                                                                    'token': id.toUpperCase(), 
                                                                    'day': { '$gte': daysAgo }
                                                                    }
                                                                },
                                                                // Step 2: Group by day, sum volume
                                                                {
                                                                    '$group': {
                                                                        '_id': '$bin',
                                                                        'buy_bin_volume': { '$sum': '$buy_bin_volume'},
                                                                        'sell_bin_volume': { '$sum': '$sell_bin_volume'},
                                                                        'buy_count': { '$sum': '$buy_count'},
                                                                        'sell_count': { '$sum': '$sell_count'},
                                                                        'rank': { '$first': '$rank' } 
                                                                    }
                                                                },
                                                                { '$sort': { 'rank': 1 } }
                                                                ]);

        const chartData = data.map(d => ({
                                            bin: d._id,
                                            rank: d.rank,
                                            buy_bin_volume: d.buy_bin_volume,
                                            sell_bin_volume: d.sell_bin_volume,
                                            buy_count: d.buy_count,
                                            sell_count: d.sell_count,
                                        }));
        

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching flow', error });
    }
};

const getFlow = async (req, res) => {
    try {
        const { id, datatype, numdays } = req.params;
        const modelFlow = mongoose.model('netflows', FlowSchema, 'netflows')

        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - numdays);
        //const timerange = daysAgo.toISOString().split('T')[0];

        const flow = await modelFlow.aggregate([// Step 1: Filter by token AND by date
                                                {
                                                    '$match': {
                                                    'token': id.toUpperCase(), 
                                                    'day': { '$gte': daysAgo }
                                                    }
                                                },
                                                // Step 2: Group by day, sum volume
                                                {
                                                    '$group': {
                                                    '_id': "$day",
                                                    'ydata': { '$sum': `$${datatype}`}
                                                    }
                                                },
                                                { '$sort': { '_id': 1 } }]);

        const chartData = flow.map(d => ({
            day: new Date(d._id).toLocaleDateString('en-US', {
                    month: 'short',day: 'numeric'}),
            ydata: d.ydata.toFixed(0)
        }));
        
        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching flow', error });
    }
};

const getFlowDex = async (req, res) => {
    try {
        const { id, numdays } = req.params;
        const modelFlow = mongoose.model('netflows', FlowSchema, 'netflows');

        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - Number(numdays)); // ensure numdays is a number

        const filter = [
            {
                '$match': {
                    'token': id.toUpperCase(), 
                    'day': { '$gte': daysAgo }
                }
            },
            {
                '$group': {
                    '_id': {
                        'day': "$day",
                        'dex': "$dex"
                    },
                    'ydata': { '$sum': '$volume' }
                }
            },
            { '$sort': { '_id': 1 } }
        ];

        const flow = await modelFlow.aggregate(filter);
        const chartData = flow.map(d => ({
            day: new Date(d._id.day).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            dex: d._id.dex,
            ydata: d.ydata
        }));

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching flow', error });
    }
};


const getLeaderboard = async (req, res) => {
  try {
    const { id, boardtype } = req.params;

    const model = mongoose.model('leaderboards', LeaderboardSchema, 'leaderboards');

    let filter, pfilter;
    switch (boardtype) {
      case 'dumpers':
        filter = { 'token': id.toUpperCase(), 'board': 'd'};
        break;
      case 'accumulators':
        filter = { 'token': id.toUpperCase(), 'board': 'a' };
        break;
      case 'bot':
        filter = { 'token': id.toUpperCase(), 'board': 'r', 'iov': { '$gte': 0 } };
        break;
      case 'top':
        filter = { 'token': id.toUpperCase(), 'board': 'r', 'iov': { '$lte': 0 } };
        break;
      default:
        return res.status(400).json({ message: 'Invalid boardtype' });
    }
    pfilter = { 'user': 1, 't_in': 1, 't_out': 1, 'iov': 1, 'rank': 1 };
    const data = await model.find(filter, pfilter).sort({'rank':1});

    let boardData;
    if (boardtype === 'dumpers') {
      boardData = data.map(d => ({
        user: d.user,
        rank: d.rank,
        t_out: d.t_out,
        iov: d.iov
      }));
    } else if (boardtype === 'accumulators') {
      boardData = data.map(d => ({
        user: d.user,
        rank: d.rank,
        t_in: d.t_in,
        iov: d.iov
        }));
    } else {
      boardData = data.map(d => ({
        user: d.user,
        rank: d.rank,
        t_in: d.t_in,
        t_out: d.t_out,
        iov: d.iov
      }));
    }

    res.status(200).json(boardData);
  } catch (error) {
    console.error('Error in getLeaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};

const getDextradesStats = async (req, res) => {
    try {
        const { id, numdays } = req.params;

        if (!id || !numdays) {
            return res.status(400).json({ message: 'Missing required parameters: id or numdays' });
        }

        const model = mongoose.models.dextradesstats || 
                      mongoose.model('dextradesstats', DextradesStatSchema, 'dextradesstats');

        const filter = { token: id.toUpperCase(), window: numdays };

        const data = await model.find(filter).lean();

        const tradersData = data.map(d => ({
            trader_type: d.trader_type, 
            uc: d.uc,
            t_in: d.t_in, 
            t_out: d.t_out, 
            v_in: d.v_in, 
            v_out: d.v_out, 
            iot: d.iot, 
            iov: d.iov, 
            tc: d.tc
        }));

        res.status(200).json(tradersData);
    } catch (error) {
        console.error('Error in getDextradesStats:', error);
        res.status(500).json({ message: 'Error fetching flow', error });
    }
};

const getWalletCounts= async (req, res) => {
    try {
        // /traderstats/:id/:numdays
        // token,window,all,old,new,abs
        const { id, numdays } = req.params;

        const model = mongoose.model('walletcounts', WalletsCountsSchema, 'walletcounts');

        filter = {'token': id.toUpperCase(),'window': numdays}
        
        const data = await model.find(filter);

        const mappeddata = data.map(d => ({
            all: d.all, 
            old: d.old,
            new: d.new, 
            abs: d.abs
        }));
        
        res.status(200).json(mappeddata);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching flow', error });
    }
};

const getUserGraph = async (req, res) => {
    try {
        // /graph/:userid/:token
        // from,to,amount,token
        const { userid, token } = req.params;
        const model = mongoose.model('transfers', UserGraphSchema, 'transfers');
        
        const ffilter =  {'token': token.toUpperCase(), '$or': [{ 'from': userid },{ 'to': userid }]};
        const pfilter =  {'from': 1, 'to': 1, 'amount':1};
        
        const data = await model.find(ffilter, pfilter)
        console.log(data);

        const mappedData = data.map(d => ({
            from: d.from,
            to: d.to,
            amount: Number(d.amount),
        }));
        
        // Then, compute totals
        let netSent = 0;
        let netReceived = 0;

        mappedData.forEach(tx => {
            if (tx.from === userid) netSent += tx.amount;
            if (tx.to === userid) netReceived += tx.amount;
        });

        res.status(200).json({
            transfers: mappedData,
            netSent,
            netReceived
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching flow', error });
    }
};

export {getDistribution, getFlow, getFlowDex, getLeaderboard, getDextradesStats, getWalletCounts, getUserGraph};