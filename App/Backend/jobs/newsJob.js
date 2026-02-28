// Este archivo se encargara de ejecutar una funcion para
// obtener las noticias cada cierto tiempo, en desarrollo
// lo hago con node-cron, en produccion lo hago con
// el cron de vercel por ejemplo
// Le que queda igual es que el server.js importe este archivo
// y la funcion updateNews()

import cron from "node-cron";
import conection from "../database/databaseConfig.js";

export default {
  updateNews,
};

// q solo deja 200 caracteres
const queryParam = [
  // Noticias de campo en general
  '("agricultura argentina" OR "campo argentino" OR "sector agropecuario")',
  // Noticias de granos
  '("soja argentina" OR "maiz argentina" OR "trigo argentina" OR "precios granos")',
  // Noticias de ganaderia
  '("ganaderia argentina" OR "produccion bovina" OR "exportacion carne")',
  // Noticias de clima
  "(sequía OR heladas OR inundaciones) AND argentina",
];

async function updateNews() {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=agricultura OR ganaderia&country=ar&lang=es&max=10&apikey=${API_KEY}`,
    );
    const data = await response.json();
    const news = data.articles;

    for (const article of news) {
      const { title, description, url, image, source } = article;
      const source_name = source.name;
      const publishedAt = article.publishedAt.split("T")[0]; // Obtener solo la fecha sin la hora

      // Verificar si la noticia ya existe en la base de datos
      const [existing] = await conection.execute(
        "SELECT id FROM news WHERE url = ?",
        [url],
      );

      if (existing.length === 0) {
        // Insertar la noticia en la base de datos
        await conection.execute(
          "INSERT INTO news (title, description, url, image, source_name, published_at) VALUES (?, ?, ?, ?, ?, ?)",
          [title, description, url, image, source_name, publishedAt],
        );
      }
    }
  } catch (error) {
    console.error("Error updating news:", error);
  }
}

// Ejecutar la función cada 6 horas
cron.schedule("0 */6 * * *", updateNews);
