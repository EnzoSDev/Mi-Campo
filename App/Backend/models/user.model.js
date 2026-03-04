import connection from "../database/databaseConfig.js";

export default {
  userActive,
  findUserByEmail,
  getCountryCodes,
  createUser,
  getUserData,
  updateUsername,
};

async function findUserByEmail(email) {
  const query = " SELECT * FROM users WHERE email = ? AND is_active = 1 ";
  const [rows] = await connection.execute(query, [email]);
  return rows[0];
}

async function userActive(userId) {
  const query = " SELECT is_active FROM users WHERE id = ? ";
  const [rows] = await connection.execute(query, [userId]);
  return rows[0].is_active;
}

async function getCountryCodes() {
  const query = " SELECT * FROM countries ";
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

async function getUserData(userId) {
  const query =
    " SELECT id, username, email, country_code FROM users WHERE id = ? ";
  const [rows] = await connection.execute(query, [userId]);
  return rows[0];
}

async function updateUsername(userId, newUsername) {
  const query = " UPDATE users SET username = ? WHERE id = ? ";
  const [result] = await connection.execute(query, [newUsername, userId]);
  return result.affectedRows;
}
