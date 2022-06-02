import joi from "joi"

export function validateRental(req, res, next) {

  const rentalsSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().min(1).required()
  })

  const rental = req.body
  const validation = rentalsSchema.validate(rental)
  if (validation.error) {
    return res.sendStatus(400)
  }

  next()
}