// const {User} = require("../models/userModel");
// async function makeATransaction(transactionAmount, user, res){
//     const currBalance = user.userBalance;
//     if(transactionAmount<0){
//        if(currBalance>=Math.abs(transactionAmount)){
//            await User.updateOne({_id:user._id}, {$inc:{userBalance:transactionAmount}})
//            return true;
//        }else {
//            res.send("Insufficient Balanace!")
//            return false;
//        }
//    }else if(transactionAmount>0){
//        await User.updateOne({_id:user._id}, {$inc:{userBalance:transactionAmount}})
//        return true;
//    }
// }

// module.exports = makeATransaction;