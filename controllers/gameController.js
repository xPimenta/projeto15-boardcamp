import db from "../config/db.js"

export async function getGames(req, res) {
  const { name } = req.query

  try {
    const params = []
    let whereClause = ''

    if (name) {
      params.push(`${name}%`)
      whereClause += `WHERE games.name ILIKE $${params.length}`
    }

    const result = await db.query(`
      SELECT games.*, categories.name AS "categoryName" 
      FROM games
      JOIN categories ON categories.id=games."categoryId"
      ${whereClause}
    `, params)

    res.send(result.rows)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function createGame(req, res) {
  const game = req.body
  try {
    const result = await db.query('SELECT id FROM categories WHERE id = $1', [game.categoryId])
    if (result.rowCount === 0) {
      return res.sendStatus(400)
    }

    await db.query(`
      INSERT INTO games(name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1, $2, $3, $4, $5);
    `, [game.name, game.image, Number(game.stockTotal), game.categoryId, Number(game.pricePerDay)])

    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}