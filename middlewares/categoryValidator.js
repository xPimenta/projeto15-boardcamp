import categorySchema from "../schemas/categorySchema.js"

export function validateCategory(req, res, next) {
  const category = req.body
  const validation = categorySchema.validate(category)
  if (validation.error) {
    return res.sendStatus(400)
  }

  next();
}