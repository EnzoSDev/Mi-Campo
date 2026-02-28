import conection from "../database/databaseConfig.js";

export default {
  getNews,
};

async function getNews() {
  const query =
    "SELECT id, title, description, url, image, source_name, published_at FROM news ORDER BY published_at DESC";
  const [rows] = await conection.execute(query);
  return rows;
}
