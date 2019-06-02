const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateLoginInput(data) {
  const errors = {};

  data.email = validText(data.email) ? data.email : ''
  data.password = validText(data.password) ? data.password : ''

  // validator.isemail doesn't seem to be working, not working due to using quotations in Postman
  // console.log(data.email)
  // console.log(Validator.isEmail(data.email))
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}