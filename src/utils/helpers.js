var validator = require("validator");

const validateSignupData = (req) => {
    const { emailId, password, role } = req.body;
    const validRoles = ["Candidate", "Recruiter"]
    
    if(!validRoles.includes(role)) throw new Error(`Role must be one of: ${validRoles.join(", ")}`)

    if(!emailId || !password) throw new Error("Email and password are required") 

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email ID");
    } 

    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not strong enough");
    } 

    return true
};

const validateEditData = (req) => {
  const allowedEditFields = ["title", "description", "company", "salary", "location", "skills"]
  let fields = Object.keys(req.body)
  console.log(fields);
  
  const isAllowedEdit = fields.every(field => allowedEditFields.includes(field))
  console.log(isAllowedEdit);
  
  return isAllowedEdit
}

module.exports = {validateSignupData, validateEditData};
