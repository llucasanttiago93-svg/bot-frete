const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: "APP_USR-3412499482890269-050510-55c40a036ea0d099a1d79d3e06d6df5b-3380859270"
});

const express = require("express");
const axios = require("axios");
const carrinhoRoutes = require("./carrinho");

const app = express();

app.use(express.json());
app.use("/", carrinhoRoutes);

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
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data = response.data;

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
      return res.json({
      resultado: "frete_gratis",
      rua: data.logradouro,
      bairro: data.bairro
});
    } else {
      return res.json({
      resultado: "frete_normal",
      rua: data.logradouro,
      bairro: data.bairro
});
    }

  } catch (error) {
    console.log("ERRO:", error.message);
    return res.status(500).json({ erro: "Erro ao consultar CEP" });
  }
});

// 🔹 ROTA PAGAMENTO
app.post("/pagamento", async (req, res) => {
  try {
    const { cliente, total, carrinho } = req.body;

    const preference = {
      items: [
        {
          title: "Pedido via WhatsApp",
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(total)
        }
      ]
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      link: response.body.init_point
    });

  } catch (error) {
    console.log("ERRO PAGAMENTO:", error.message);
    res.status(500).json({ erro: "Erro ao criar pagamento" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando 🚀");
});