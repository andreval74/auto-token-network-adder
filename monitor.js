const { ethers } = require("ethers");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const infuraProjectId = "YOUR_INFURA_PROJECT_ID";
const walletAddress = "YOUR_WALLET_ADDRESS";

const provider = new ethers.providers.InfuraProvider("mainnet", infuraProjectId);

provider.on("pending", async (tx) => {
  const transaction = await provider.getTransaction(tx);
  if (transaction && transaction.to && transaction.to.toLowerCase() === walletAddress.toLowerCase()) {
    console.log("Novo token ou rede detectado:", transaction);
    // Adicione lógica para enviar notificação ao celular via API
  }
});

// Adicionando uma rota básica
app.get("/", (req, res) => {
  res.send("Servidor está rodando e monitorando as transações.");
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
