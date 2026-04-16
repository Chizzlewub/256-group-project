const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "submissions.json");

app.use(cors());
app.use(express.json());

// Make sure the data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ─── GET /articles ────────────────────────────────────────────────────────────
// Returns all articles (used by Order History page)
app.get("/articles", (req, res) => {
  try {
    const articles = readData();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to read data." });
  }
});

// ─── POST /articles ───────────────────────────────────────────────────────────
// Saves a new article submission with status = "pending"
app.post("/articles", (req, res) => {
  try {
    const articles = readData();

    // Auto-generate an ID
    const maxId = articles.length
      ? Math.max(...articles.map(a => a.numericId || 0))
      : 0;
    const numericId = maxId + 1;
    const id = "ART-" + String(numericId).padStart(3, "0");

    const newArticle = {
      id,
      numericId,
      ...req.body,
      status: "pending",           // always starts as pending
      submittedAt: new Date().toISOString()
    };

    articles.push(newArticle);
    writeData(articles);

    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: "Failed to save article." });
  }
});

// ─── PUT /articles/:id ────────────────────────────────────────────────────────
// Updates an article's status (approve or decline) — used by Approval page
app.put("/articles/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'approved' or 'declined'." });
    }

    const articles = readData();
    const index = articles.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Article not found." });
    }

    articles[index].status = status;
    articles[index].reviewedAt = new Date().toISOString();
    writeData(articles);

    res.json(articles[index]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update article." });
  }
});

app.listen(PORT, () => {
  console.log(`Sports Daily server running at http://localhost:${PORT}`);
  console.log(`Data stored in: ${DATA_FILE}`);
});
