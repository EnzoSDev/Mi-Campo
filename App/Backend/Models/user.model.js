import connection from "../Database/databaseConfig.js";

export default {
  findUserByEmail,
  getCountryCodes,
  createUser,
};

async function findUserByEmail(email) {
  const query = " SELECT * FROM users WHERE email = ? ";
  const [rows] = await connection.execute(query, [email]);
  return rows[0];
}

async function getCountryCodes() {
  const query = " SELECT * FROM Countries ";
  const [rows] = await connection.execute(query);
  return rows;
}

async function createUser({ username, email, passwordHash, countryCode }) {
  const query =
    " INSERT INTO users (username, email, password_hashed, country_code, is_active) VALUES (?, ?, ?, ?, ?) ";
  const [result] = await connection.execute(query, [
    username,
    email,
    passwordHash,
    countryCode,
    true,
  ]);
  return result.affectedRows;
}
