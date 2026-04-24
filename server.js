const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.get("/cep", async (req, res) => {
  const cep = req.query.cep;

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (cep.startsWith("0484") || cep.startsWith("0485") || cep.startsWith("0486")) {
      return res.json({ resultado: "frete_gratis" });
    } else {
      return res.json({ resultado: "frete_normal" });
    }

  } catch (error) {
    return res.status(500).json({ erro: "Erro ao consultar CEP" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});