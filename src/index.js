const express = require("express");
const { Client } = require("pg");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à PostgreSQL (Sans .env pour éviter les erreurs)
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Zohra2004", 
  database: "blog_db",
});

client
  .connect()
  .then(() => console.log("✅ Connexion à PostgreSQL réussie !"))
  .catch((err) => {
    console.error("❌ Erreur de connexion à PostgreSQL :", err);
    process.exit(1); // Quitter l'application en cas d'erreur
  });

// Route GET - Récupérer tous les articles
app.get("/articles", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM articles");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des articles :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route POST - Ajouter un nouvel article
app.post("/articles", async (req, res) => {
  const { titre, contenu } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO articles (titre, contenu) VALUES ($1, $2) RETURNING *",
      [titre, contenu]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout d'un article :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route DELETE - Supprimer un article par ID
app.delete("/articles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM articles WHERE id = $1", [id]);
    res.json({ message: "Article supprimé" });
  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});





