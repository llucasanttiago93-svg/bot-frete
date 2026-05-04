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
  let { cliente, produto, qtd, preco } = req.body;

  if (!cliente) {
  return res.json({ erro: "Cliente não enviado" });
}

cliente = String(cliente).trim();

  if (!cliente || !produto || !qtd || !preco) {
    return res.json({ erro: "Dados incompletos" });
  }

  if (!carrinhos[cliente]) {
    carrinhos[cliente] = [];
  }

  const itemExistente = carrinhos[cliente].find(
  item => item.produto === produto
);

if (itemExistente) {
  itemExistente.qtd += Number(qtd);
} else {
  carrinhos[cliente].push({
    id: Date.now(),
    produto,
    qtd: Number(qtd),
    preco: Number(preco)
  });
}

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

router.post("/carrinho/clear", (req, res) => {
  const { cliente } = req.body;

  if (!cliente) {
    return res.json({ erro: "Cliente não enviado" });
  }

  carrinhos[cliente] = [];

  return res.json({
    carrinho: "",
    total: 0
  });
});

router.post("/carrinho/update", (req, res) => {
  const { cliente, produto, qtd } = req.body;

  if (!cliente || !produto || !qtd) {
    return res.json({ erro: "Dados incompletos" });
  }

  if (!carrinhos[cliente]) {
    return res.json({ carrinho: "", total: 0 });
  }

  // atualiza o produto
  carrinhos[cliente] = carrinhos[cliente].map(item => {
    if (item.produto === produto) {
      return {
        ...item,
        qtd: Number(qtd)
      };
    }
    return item;
  });

  // recalcula total
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