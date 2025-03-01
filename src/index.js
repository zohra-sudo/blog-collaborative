const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
// Connexion à PostgreSQL
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

  if (!titre || !contenu) {
    return res.status(400).json({ error: "Titre et contenu sont obligatoires" });
  }

  const date_creation = new Date().toISOString(); // Ajouter la date de création

  try {
    const result = await client.query(
      "INSERT INTO articles (titre, contenu, date_creation) VALUES ($1, $2, $3) RETURNING *",
      [titre, contenu, date_creation]
    );
    res.status(201).json(result.rows[0]); // Retourner l'article créé
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout d'un article :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route DELETE - Supprimer un article par ID
app.delete("/articles/:id", async (req, res) => {
  const { id } = req.params;

  // Vérifier si l'article existe avant de tenter de le supprimer
  try {
    const result = await client.query("SELECT * FROM articles WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    // Si l'article existe, le supprimer
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
// ajout d une ligne de teste pour tester lepull request;;; 



