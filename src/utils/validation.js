const Validator = require("validator");
const validation = (req) => {
    const {firstName, lastName, emailId, password, middleName, age, gender, skills, about, imageURL} = req.body;
    if(!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are mandatory");
    }
    else if(!Validator.isEmail(emailId)) {
        throw new Error("Invalid email: " + emailId);
    }
    else if(!Validator.isStrongPassword(password)) {
        throw new Error("Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character");
    }
    else if(imageURL && !Validator.isURL(imageURL)) {
        throw new Error("Invalid URL: " + imageURL);
    }
};

const validateFieldsToEdit = (req) => {
    const {firstName, middleName, lastName, emailId, age, gender, skills, about, imageURL} = req.body;
    if(emailId && !Validator.isEmail(emailId)) {
        throw new Error("Invalid email: " + emailId);
    }
    else if(imageURL && !Validator.isURL(imageURL)) {
        throw new Error("Invalid URL: " + imageURL);
    }
};

module.exports = {validation, validateFieldsToEdit};