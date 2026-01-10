import connection from '../Database/databaseConfig'

export default {
  findUserByEmail,
  createUser
}

async function findUserByEmail (email) {
  const query = ' SELECT * FROM users WHERE email = ? '
  const [rows] = await connection.execute(query, [email])
  return rows[0]
}

async function createUser ({ username, email, password, country }) {
  const query = ' INSERT INTO users (username, email, password, country) VALUES (?, ?, ?, ?) '
  const [result] = await connection.execute(query, [username, email, password, country])
  return result.affectedRows
}
