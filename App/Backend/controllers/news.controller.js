import newsModel from "../models/news.model.js";

export default {
  handlerGetNews,
};

async function handlerGetNews(req, res) {
  try {
    const news = await newsModel.getNews();
    news.forEach((item) => {
      item.published_at = item.published_at.toISOString().split("T")[0];
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las noticias" });
  }
}
