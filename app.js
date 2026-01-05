const CONTRACT_ADDRESS = "0xd54231527a89400652a175a7f5d30de6c6e00e0a";

const ABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function init() {
  if (!window.ethereum) {
    document.getElementById("status").innerText =
      "MetaMask required to enter the arena.";
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("wallet").innerText =
    "Wallet: " + address;

  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  updateSupply();
}

async function updateSupply() {
  try {
    const supply = await contract.totalSupply();
    document.getElementById("supply").innerText =
      "Total Minted: " + supply.toString();
  } catch (err) {
    console.error(err);
  }
}

async function mint() {
  try {
    document.getElementById("status").innerText =
      "Minting Paragon…";

    const tx = await contract.mint();
    await tx.wait();

    document.getElementById("status").innerText =
      "Paragon Minted ✔️";

    updateSupply();
  } catch (err) {
    document.getElementById("status").innerText =
      "Error: " + err.message;
  }
}

document.getElementById("mintBtn").onclick = mint;

window.onload = init;
