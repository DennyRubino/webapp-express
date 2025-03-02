const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

app.use(express.json());

app.use(cors());

app.get("/movies", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, title FROM movies");
    res.json(rows);
  } catch (error) {
    console.error(" Errore SQL:", error.sqlMessage || error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [movies] = await db.query(
      "SELECT id, title FROM movies WHERE id = ?",
      [id]
    );
    if (movies.length === 0) {
      return res.status(404).json({ error: "Film non trovato" });
    }
    const movie = movies[0];
    const [reviews] = await db.query(
      "SELECT id, name, vote, text, updated_at FROM reviews WHERE movie_id = ?",
      [id]
    );
    movie.reviews = reviews;
    res.json(movie);
  } catch (error) {
    console.error("Errore nel recupero del film:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/movies/:movieId/reviews", async (req, res) => {
  try {
    const { movieId } = req.params;
    const { name, vote, text } = req.body;

    if (vote < 1 || vote > 5) {
      return res
        .status(400)
        .json({ error: "Il voto deve essere compreso tra 1 e 5" });
    }

    const [result] = await db.query(
      "INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)",
      [movieId, name, vote, text]
    );

    const [rows] = await db.query(
      "SELECT id, name, vote, text, updated_at FROM reviews WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Errore nell'aggiunta della recensione:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint non trovato" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
