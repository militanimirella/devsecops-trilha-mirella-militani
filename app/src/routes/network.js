const express = require("express");
const router = express.Router();
const { execFile } = require("child_process");

// GET /api/ping?host=<endereço> - diagnóstico de rede seguro
router.get("/ping", (req, res) => {
  const { host } = req.query;
  if (!host) return res.status(400).json({ error: "Parâmetro 'host' é obrigatório" });

  // Validação simples para permitir apenas hostname ou IP sem caracteres especiais do shell
  const safeHostPattern = /^[a-zA-Z0-9.-]+$/;
  if (!safeHostPattern.test(host)) {
    return res.status(400).json({ error: "Parâmetro 'host' inválido" });
  }

  // execFile executa o binário diretamente sem invocar um shell intermediário
  execFile("ping", ["-c", "2", host], (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: "Falha ao executar ping", details: stderr });
    res.json({ host, output: stdout });
  });
});

module.exports = router;