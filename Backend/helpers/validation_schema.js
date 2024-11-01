const joi = require("@hapi/joi"); //Joi is for validataion

const authSchema = joi.object({
  username: joi.string().lowercase(),
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(3).required(),
  bi0: joi.string(),
  createdBattles: joi.array(),
  profileImage: joi.string(),
});

module.exports = {
  authSchema,
};
