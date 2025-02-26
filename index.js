const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/movies", async (req, res) => {
  try {
    const [movies] = await db.query("SELECT * FROM movies");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/movies/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const [movie] = await db.query("SELECT * FROM movies WHERE id = ?", [
      movieId,
    ]);
    const [reviews] = await db.query(
      "SELECT * FROM reviews WHERE movie_id = ?",
      [movieId]
    );

    if (movie.length === 0) {
      return res.status(404).json({ message: "Film non trovato" });
    }

    res.json({ ...movie[0], reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
