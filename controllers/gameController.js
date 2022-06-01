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
      JOIN categories ON categories.id = games."categoryId"
      ${whereClause}
    `, params)

    res.send(result.rows)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
