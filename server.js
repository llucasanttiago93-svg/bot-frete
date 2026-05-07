const nodemailer = require("nodemailer");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-5977139545122971-050609-9ddfba606968d2571d5ec617e5c71bfe-3380859270"
});

const express = require("express");
const axios = require("axios");
const carrinhoRoutes = require("./carrinho");

const app = express();

const pagamentosProcessados = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "llucasanttiago93@gmail.com",
    pass: "eirubcsbslimhfeb"
  }
});

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

app.post("/pagamento", async (req, res) => {
  try {
    const { total, cliente, subscriber_id } = req.body;

    const preference = new Preference(client);

    const response = await preference.create({
  body: {
    items: [
      {
        title: "Pedido via WhatsApp",
        quantity: 1,
        currency_id: "BRL",
        unit_price: Number(total)
      }
    ],

    metadata: {
  cliente: cliente,
  subscriber_id: subscriber_id
},

    notification_url: "https://bot-frete.onrender.com/webhook-mp"
  }
});

    res.json({
      link: response.init_point
    });

  } catch (error) {
    console.log("ERRO PAGAMENTO:", error);
    res.status(500).json({ erro: "Erro ao criar pagamento" });
  }
});

app.post("/webhook-mp", async (req, res) => {
  const data = req.body;

  console.log("WEBHOOK:", data);

  if (data.type === "payment") {
    const paymentId = data.data.id;

    console.log("💰 ID DO PAGAMENTO:", paymentId);

    try {
      const payment = new Payment(client);

      const paymentInfo = await payment.get({
        id: paymentId
      });

      console.log("STATUS:", paymentInfo.status);

      if (paymentInfo.status === "approved") {

	if (pagamentosProcessados[paymentId]) {
  	console.log("⚠️ PAGAMENTO JÁ PROCESSADO");
  	return res.sendStatus(200);
	}
        
        const cliente = paymentInfo.metadata.cliente;

	const subscriberId = paymentInfo.metadata.subscriber_id;

        console.log("📱 TELEFONE DO CLIENTE:", cliente);

        console.log("✅ PAGAMENTO APROVADO!");

	console.log("🆔 SUBSCRIBER ID:", subscriberId);
	
await axios.post(
  `https://backend.botconversa.com.br/api/v1/webhook/subscriber/${subscriberId}/send_message/`,
  {
    type: "text",
    value: "✅ Pagamento aprovado! Seu pedido está sendo preparado 🚀"
  },
  {
    headers: {
      "API-KEY": "5b36e380-f1b6-4dff-b1bc-120870250612"
    }
  }
);

console.log("📨 MENSAGEM ENVIADA!");

pagamentosProcessados[paymentId] = true;

/*await transporter.sendMail({
  from: "llucasanttiago93@gmail.com",
  to: "llucasanttiago93@gmail.com",
  subject: "🚀 Novo pedido aprovado",
  text: `
Novo pedido aprovado!

Telefone: ${cliente}

Subscriber ID: ${subscriberId}

Pagamento aprovado no Mercado Pago.
`
});
console.log("📧 EMAIL ENVIADOOOO!");
*/
            }

    } catch (error) {
      console.log("ERRO COMPLETO:");
      console.log(error);
    }
  }

  res.sendStatus(200);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando 🚀");
});