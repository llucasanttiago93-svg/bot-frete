const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

// 🔹 Rota básica pra teste (saúde do servidor)
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// 🔹 Rota principal (USAR NO BOTCONVERSA)
app.get("/cep-check", async (req, res) => {
  const cep = req.query.cep;

  console.log("CEP RECEBIDO:", cep);

  if (!cep) {
    return res.json({ erro: "CEP não enviado" });
  }

  try {
    // (opcional) valida CEP com ViaCEP
    await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    // 🔥 REGRA DE FRETE
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
    console.log("ERRO:", error.message);
    return res.status(500).json({ erro: "Erro ao consultar CEP" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando 🚀");
});