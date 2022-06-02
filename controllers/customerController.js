import db from "../config/db.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    const params = [];
    let whereClause = '';

    if (cpf) {
      params.push(`${cpf}%`);
      whereClause += `WHERE cpf ILIKE $${params.length}`; // case insenstive
    }

    const result = await db.query(`
      SELECT * FROM customers
      ${whereClause}
    `, params);

    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // internal server error
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    return res.sendStatus(400); // bad request
  }

  try {
    const result = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.sendStatus(404); // not found
    }

    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // internal server error
  }
}

export async function createCustomer(req, res) {
  const customer = req.body;
  try {
    const result = await db.query('SELECT id FROM customers WHERE cpf = $1', [customer.cpf]);
    if (result.rowCount > 0) {
      return res.sendStatus(409); // conflict
    }

    await db.query(`
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ($1, $2, $3, $4);
    `, [customer.name, customer.phone, customer.cpf, customer.birthday]);

    res.sendStatus(201); // created
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // internal server error
  }
}

export async function updateCustomer(req, res) {
  const customer = req.body;
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    return res.sendStatus(400); // bad request
  }

  try {
    const result = await db.query(`
      SELECT id FROM customers WHERE cpf = $1 AND id != $2
    `, [customer.cpf, id]);
    if (result.rowCount > 0) {
      return res.sendStatus(409); // conflict
    }

    await db.query(`
      UPDATE customers 
      SET 
        name = $1, 
        phone = $2, 
        cpf = $3, 
        birthday = $4 
      WHERE id = $5
    `, [customer.name, customer.phone, customer.cpf, customer.birthday, id]);

    res.sendStatus(200); // ok
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // internal server error
  }
}