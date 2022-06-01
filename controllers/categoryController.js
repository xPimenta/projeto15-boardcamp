import db from "../config/db.js"

export async function getCategories(req, res) {
  try {
    const result = await db.query(`
      SELECT * FROM categories
    `)
    res.send(result.rows)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
