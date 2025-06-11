const { ethers } = require("ethers");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const networks = {
  '1': {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    chainId: '0x1',
    currency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    explorer: 'https://etherscan.io/'
  },
  // Adicione outras redes aqui, por exemplo:
  // '56': { name: 'Binance Smart Chain', rpcUrl: 'https://bsc-dataseed.binance.org/', currency: { name: 'BNB', symbol: 'BNB', decimals: 18 } }
};

app.post("/add-token-network", async (req, res) => {
  try {
    const tokenAddress = req.body.contractAddress;
    const tokenDetails = await getTokenDetails(tokenAddress);

    if (!tokenDetails) {
      res.status(404).send({ message: "Token not found or is inactive" });
      return;
    }

    const network = getNetworkForToken(tokenDetails.chainId);
    if (!network) {
      return res.status(400).send({ success: false, message: "Rede não suportada." });
    }

    const payload = {
      token: {
        address: tokenDetails.address,
        symbol: tokenSymbol,
        decimals: tokenDetails.decimals,
      },
      chain: network
    };

    // Envie o payload para o MetaMask através do serviço de notificação
    // Assumindo que há um frontend para invocar a adição de token e rede

    res.send({success: true, message: "Token e Rede detectados. Aguardando confirmação do usuário no MetaMask."});
  } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Erro ao processar o contrato." });
  }
});

async function getTokenDetails(contractAddress) {
  const contract = new ethers.Contract(contractAddress, tokenAbi, provider);

  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);
    return { name, symbol, decimals, address: contract.address };
  } catch (error) {
    console.error("Erro ao recuperar detalhes do token:", error);
    return null;
  }
}

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
