import db from "../config/db.js"

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query

  try {
    const params = []
    const conditions = []
    let whereClause = ''

    if (customerId) {
      params.push(customerId)
      conditions.push(`rentals."customerId" = $${params.length}`)
    }

    if (gameId) {
      params.push(gameId)
      conditions.push(`rentals."gameId"=$${params.length}`)
    }

    if (params.length > 0) {
      whereClause += `WHERE ${conditions.join(" AND ")}`
    }

    const result = await db.query({
      text: `
        SELECT 
          rentals.*,
          customers.name AS customer,
          games.name,
          categories.*
        FROM rentals
          JOIN customers ON customers.id=rentals."customerId"
          JOIN games ON games.id=rentals."gameId"
          JOIN categories ON categories.id=games."categoryId"
        ${whereClause}
      `,
      rowMode: "array"
    }, params)

    res.send(result.rows.map(_mapRentalsArrayToObject));
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}


export async function rent(req, res) {
  const rental = req.body
  try {
    const customersResult = await db.query(`
      SELECT id FROM customers WHERE id = $1
    `, [rental.customerId])
    if (customersResult.rowCount === 0) {
      return res.sendStatus(400)
    }

    const gameResult = await db.query(`
      SELECT * FROM games WHERE id=$1
    `, [rental.gameId])
    if (gameResult.rowCount === 0) {
      return res.sendStatus(400)
    }
    const game = gameResult.rows[0];

    const result = await db.query(`
      SELECT id
      FROM rentals 
      WHERE "gameId" = $1 AND "returnDate" IS null
    `, [rental.gameId])

    if (result.rowCount > 0) {
      if (game.stockTotal === result.rowCount) {
        return res.sendStatus(400)
      }
    }

    const originalPrice = rental.daysRented * game.pricePerDay;
    await db.query(`
      INSERT INTO 
        rentals (
          "customerId", "gameId", "rentDate", 
          "daysRented", "returnDate", "originalPrice", "delayFee"
        )
        VALUES ($1, $2, NOW(), $3, null, $4, null); 
      `, [rental.customerId, rental.gameId, rental.daysRented, originalPrice])

    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function finish(req, res) {
  const {id} = req.params
  try {
    const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id])
    if(result.rowCount === 0) return res.sendStatus(404)
    
    const rental = result.rows[0]
    if(rental.returnDate) return res.sendStatus(400)
    else {
      const diff = new Date().getTime() - new Date(rental.rentDate).getTime()
      const diffInDays = Math.floor(diff / (24 * 3600 * 1000))

      let delayFee = 0
      if (diffInDays > rental.daysRented) {
        const addicionalDays = diffInDays - rental.daysRented
        delayFee = addicionalDays * rental.originalPrice
        console.log("delayFee", addicionalDays)
      };

      
      await db.query(`
        UPDATE rentals 
        SET "returnDate" = NOW(), "delayFee" = $1
        WHERE id = $2    
      `, [delayFee, id])

      res.sendStatus(200)
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function deleteRental(req, res) {
  const {id} = req.params
  try {
    const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id])
    if(result.rowCount === 0) {
      res.sendStatus(404)
    } else {
      const rental = result.rows[0];
      if(!rental.returnDate) res.sendStatus(400)
      else {
        await db.query(`DELETE FROM rentals WHERE id = $1`, [id])
      }
    }
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

function _mapRentalsArrayToObject(row) {
  const [
    id, customerId, gameId,
    rentDate, daysRented, returnDate,
    originalPrice, delayFee, customerName,
    gameName, categoryId, categoryName
  ] = row;

  return {
    id,
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
    customer: {
      id: customerId,
      name: customerName
    },
    game: {
      id: gameId,
      name: gameName,
      categoryId,
      categoryName
    }
  }
}