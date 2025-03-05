const jwt = require('jsonwebtoken');
const User = require('../models/user');


const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            throw new Error("token not found");
        }
        const decodedMsg = jwt.verify(token, "secretDevTinder");
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