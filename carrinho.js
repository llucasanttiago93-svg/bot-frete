const express = require("express");

const router = express.Router();

// 🧠 "Banco de dados" em memória
const carrinhos = {};

// 🔹 Rota de teste
router.get("/carrinho-test", (req, res) => {
  res.json({ status: "carrinho ok" });
});


// 🔥 NOVA ROTA (COLA AQUI)
router.post("/carrinho/add", (req, res) => {
  const { cliente, produto, qtd, preco } = req.body;

  if (!cliente || !produto || !qtd || !preco) {
    return res.json({ erro: "Dados incompletos" });
  }

  if (!carrinhos[cliente]) {
    carrinhos[cliente] = [];
  }

  carrinhos[cliente].push({
    produto,
    qtd: Number(qtd),
    preco: Number(preco)
  });

  const total = carrinhos[cliente].reduce((acc, item) => {
    return acc + item.qtd * item.preco;
  }, 0);

  const carrinhoTexto = carrinhos[cliente]
    .map(item => `• ${item.produto} x${item.qtd}`)
    .join("\n");

  return res.json({
    carrinho: carrinhoTexto,
    total
  });
});


module.exports = router;