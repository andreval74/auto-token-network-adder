const { ethers } = require("ethers");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const provider = new ethers.providers.InfuraProvider("mainnet", "YOUR_INFURA_PROJECT_ID");

async function getTokenDetails(contractAddress) {
    const erc20Abi = [
        "function name() public view returns (string)",
        "function symbol() public view returns (string)",
        "function decimals() public view returns (uint8)"
    ];

    const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();

    return { name, symbol, decimals };
}

app.post("/add-token", async (req, res) => {
    const { contractAddress } = req.body;

    try {
        const tokenDetails = await getTokenDetails(contractAddress);
        res.json({ success: true, tokenDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao buscar detalhes do token." });
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
