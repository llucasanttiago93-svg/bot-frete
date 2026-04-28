const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

// 🔥 LISTA DE CEP
const cepFreteGratis = [
  "04830","04831","04832","04833","04834","04835",
  "04836","04837","04838","04839","04840","04841",
  "04842","04843","04844","04845","04846","04847",
  "04848","04849","04850","04851","04852","04853",
  "04854","04855","04856","04857","04858","04859",
  "04860","04861","04862","04863","04864","04865",
  "04866","04867","04868","04869",

  "04770","04771","04772","04773","04774","04775",
  "04776","04777","04778","04779","04780","04781",
  "04782","04783","04784","04785","04786","04787",
  "04788","04789","04790","04791","04792","04793",
  "04794","04795","04796","04797","04798","04799",

  "04760","04761","04762","04763","04764",

  "04880","04881","04882","04883","04884"
];

// rota teste
app.get("/cep", (req, res) => {
  res.json({ status: "ok" });
});

// rota principal
app.post("/cep", async (req, res) => {
  const cep = req.body.cep || req.body.root?.cep;

  if (!cep) {
    return res.json({ erro: "CEP não enviado" });
  }

  try {
    await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    const prefixo = cep.substring(0, 5);

    if (cepFreteGratis.includes(prefixo)) {
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
  console.log("Servidor rodando 🚀");
});