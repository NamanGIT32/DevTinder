const Validator = require("validator");
const validation = (req) => {
    const {firstName, lastName, emailId, password, imageURL} = req.body;
    if(!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are mandatory");
    }
    else if(!Validator.isEmail(emailId)) {
        throw new Error("Invalid email: " + emailId);
    }
    else if(!Validator.isStrongPassword(password)) {
        throw new Error("Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character");
    }
    // else if(!Validator.isURL(imageURL)) {
    //     throw new Error("Invalid URL: " + imageURL);
    // }
}


module.exports = validation;