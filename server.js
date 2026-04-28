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
      // 🔵 GRAJAÚ
      cep.startsWith("0483") ||
      cep.startsWith("0484") ||
      cep.startsWith("0485") ||
      cep.startsWith("0486") ||

      // 🟢 CIDADE DUTRA
      cep.startsWith("0477") ||
      cep.startsWith("0478") ||
      cep.startsWith("0479") ||

      // 🟡 SOCORRO (PARCIAL)
      cep.startsWith("04760") ||
      cep.startsWith("04761") ||
      cep.startsWith("04762") ||
      cep.startsWith("04763") ||
      cep.startsWith("04764") ||

      // 🟠 PARELHEIROS (PARCIAL)
      cep.startsWith("04880") ||
      cep.startsWith("04881") ||
      cep.startsWith("04882") ||
      cep.startsWith("04883") ||
      cep.startsWith("04884")
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