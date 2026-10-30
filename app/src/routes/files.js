const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");

// GET /api/files/:filename - lê e devolve o conteúdo de um arquivo da pasta uploads/
router.get("/:filename", (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(UPLOADS_DIR, safeFilename);

  // Previne Path Traversal garantindo que o caminho resolvido está dentro de UPLOADS_DIR
  if (!filePath.startsWith(UPLOADS_DIR)) {
    return res.status(400).json({ error: "Caminho de arquivo inválido" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).json({ error: "Arquivo não encontrado" });
    res.type("text/plain").send(data);
  });
});

module.exports = router;