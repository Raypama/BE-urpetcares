const { default: axios } = require("axios");
require("dotenv").config();

API_KEY =
  "31f0b4445cfd64e9373f943837fd32a8283fc961cb62964c8a7f28052fb0beec";

exports.getNewsBlog = async (req,res) => {
    try {
        const response = await axios.get(
          `https://serpapi.com/search.json?hl=en&gl=us&engine=google_news&q=pets%20lovers&api_key=${API_KEY}`
        );
        res.json(response.data.news_results);
      } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data" });
      }
}