import joi from "joi"

export function validateCategory(req, res, next) {

  const categorySchema = joi.object({
    name: joi.string().required()
  });

  const category = req.body
  const validation = categorySchema.validate(category)
  if (validation.error) {
    return res.sendStatus(400)
  }

  next();
}