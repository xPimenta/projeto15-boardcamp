import joi from "joi";

export function validateGame(req, res, next) {

const gameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().uri().required(),
  stockTotal: joi.string().required(),
  categoryId: joi.number().required(),
  pricePerDay: joi.string().required()
});

  const game = req.body;
  const validation = gameSchema.validate(game);
  if (validation.error) {
    return res.sendStatus(400); // bad request
  }

  next();
}