import connection from "../database/databaseConfig.js";

export default {
  userActive,
  findUserByEmail,
  getCountryCodes,
  createUser,
  getUserData,
  updateUsername,
  findUserById,
  changePassword,
  updateProfileImage,
  getUserIdByProfileImage,
};

async function findUserByEmail(email) {
  const query = " SELECT * FROM users WHERE email = ? AND is_active = 1 ";
  const [rows] = await connection.execute(query, [email]);
  return rows[0];
}

async function findUserById(userId) {
  const query = " SELECT * FROM users WHERE id = ? AND is_active = 1 ";
  const [rows] = await connection.execute(query, [userId]);
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
    " SELECT id, username, email, country_code, profile_image FROM users WHERE id = ? ";
  const [rows] = await connection.execute(query, [userId]);
  return rows[0];
}

async function updateUsername(userId, newUsername) {
  const query = " UPDATE users SET username = ? WHERE id = ? ";
  const [result] = await connection.execute(query, [newUsername, userId]);
  return result.affectedRows;
}

async function changePassword(userId, newPasswordHash) {
  const query = " UPDATE users SET password_hashed = ? WHERE id = ? ";
  const [result] = await connection.execute(query, [newPasswordHash, userId]);
  return result.affectedRows;
}

async function updateProfileImage(userId, picturePath) {
  const query = " UPDATE users SET profile_image = ? WHERE id = ? ";
  const [result] = await connection.execute(query, [picturePath, userId]);
  return result.affectedRows;
}

async function getUserIdByProfileImage(imagePath) {
  const query = " SELECT id FROM users WHERE profile_image = ? AND is_active = 1 ";
  const [rows] = await connection.execute(query, [imagePath]);
  return rows[0]?.id;
}
