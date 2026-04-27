const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/cep", async (req, res) => {
  const cep = req.body.cep || req.body.root?.cep;

  if (!cep) {
    return res.json({ erro: "CEP não enviado" });
  }

  try {
    await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (
      cep.startsWith("0484") ||
      cep.startsWith("0485") ||
      cep.startsWith("0486")
    ) {
      return res.json({ resultado: "frete_gratis" });
    } else {
      return res.json({ resultado: "frete_normal" });
    }

  } catch (error) {
    return res.status(500).json({ erro: "Erro ao consultar CEP" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando");
});