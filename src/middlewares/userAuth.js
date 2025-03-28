const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({response:"User not authenticated"});
        }
        const decodedMsg = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedMsg.id;
        const user = await User.findById(id);
        if(!user){
            throw new Error("user not found");
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(400).json({response:"User Authentication falied", err:err.message, stack:err.stack});
    }
};

module.exports = {userAuth};