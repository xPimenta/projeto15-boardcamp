import joi from "joi";

export function validateCustomer(req, res, next) {
  
const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11).required(),
  cpf: joi.string().length(11).required(),
  birthday: joi.date().required(),
});

  const customer = req.body
  const validation = customerSchema.validate(customer)
  if (validation.error) {
    return res.sendStatus(400)
  }

  next();
}