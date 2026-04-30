const express = require("express");

const router = express.Router();

// 🧠 "Banco de dados" em memória
const carrinhos = {};

// 🔹 Rota de teste
router.get("/carrinho-test", (req, res) => {
  res.json({ status: "carrinho ok" });
});

module.exports = router;