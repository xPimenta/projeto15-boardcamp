import db from "../config/db.js"

export async function getCustomers(req, res) {
  const { cpf } = req.query

  try {
    const params = []
    let whereClause = ''

    if (cpf) {
      params.push(`${cpf}%`)
      whereClause += `WHERE cpf ILIKE $${params.length}`
    }

    const result = await db.query(`
      SELECT * FROM customers
      ${whereClause}
    `, params)

    res.send(result.rows)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params

  if (isNaN(parseInt(id))) {
    return res.sendStatus(400)
  }

  try {
    const result = await db.query(`SELECT * FROM customers WHERE id = $1`, [id])
    if (result.rowCount === 0) {
      return res.sendStatus(404)
    }

    res.send(result.rows[0])
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function createCustomer(req, res) {
  const customer = req.body
  try {
    const result = await db.query('SELECT id FROM customers WHERE cpf = $1', [customer.cpf])
    if (result.rowCount > 0) {
      return res.sendStatus(409)
    }

    await db.query(`
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ($1, $2, $3, $4);
    `, [customer.name, customer.phone, customer.cpf, customer.birthday])

    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function updateCustomer(req, res) {
  const customer = req.body
  const { id } = req.params

  if (isNaN(parseInt(id))) {
    return res.sendStatus(400)
  }

  try {
    const result = await db.query(`
      SELECT id FROM customers WHERE cpf = $1 AND id != $2
    `, [customer.cpf, id])
    if (result.rowCount > 0) {
      return res.sendStatus(409)
    }

    await db.query(`
      UPDATE customers 
      SET 
        name = $1, 
        phone = $2, 
        cpf = $3, 
        birthday = $4 
      WHERE id = $5
    `, [customer.name, customer.phone, customer.cpf, customer.birthday, id])

    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}