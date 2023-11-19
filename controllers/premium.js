import User from '../models/User.js';
import Expense from '../models/Expense.js';
import sequelize from '../data/database.js';

const getUserLeaderBoard = async (req, res) => {
    try{
        const leaderboardofusers =  await User.findAll({
            attributes: [
              'id',
              'username',
              [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_cost'],
            ],
            include: [  
              {
                model: Expense,
                attributes: [],
              },
            ],
            group: ['user.id'],
            order: [[sequelize.literal('total_cost'), 'DESC']],
        });
      console.log(leaderboardofusers);
      
      // res.send(leaderboardofusers);
      res.status(200).json(leaderboardofusers);
          
    
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

export default getUserLeaderBoard;