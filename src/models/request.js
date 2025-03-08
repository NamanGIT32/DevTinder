const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "Invalid status found"
        }
    }
});

// a compound index for fromUserId and toUserId
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("connot sent connection request to itself");
    }
    next();
})

const connectionRequestModel = mongoose.model('Request', connectionRequestSchema);
module.exports = {connectionRequestModel};