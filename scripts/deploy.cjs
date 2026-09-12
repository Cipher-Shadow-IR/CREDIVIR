const hre = require("hardhat");

const EXPLORER_URLS = {
  11155111: "https://sepolia.etherscan.io",
  1: "https://etherscan.io"
};

function getExplorerUrl(chainId, address) {
  const base = EXPLORER_URLS[chainId] || "https://etherscan.io";
  return `${base}/address/${address}`;
}

async function main() {
  const networkName = hre.network.name;

  if (networkName === "sepolia" && !process.env.SEPOLIA_RPC_URL) {
    throw new Error(
      "SEPOLIA_RPC_URL is not set. Add it to the root .env (see .env.example)."
    );
  }

  if (networkName === "sepolia" && !process.env.PRIVATE_KEY) {
    throw new Error(
      "PRIVATE_KEY is not set. Add it to the root .env (see .env.example). Never commit this file."
    );
  }

  if (networkName === "sepolia") {
    const { chainId } = await hre.ethers.provider.getNetwork();
    if (Number(chainId) !== 11155111) {
      throw new Error(
        `Refusing to deploy: connected chainId is ${chainId}, expected 11155111 (Sepolia).`
      );
    }
  }

  const CertificateVerification = await hre.ethers.getContractFactory(
    "CertificateVerification"
  );
  const contract = await CertificateVerification.deploy();

  await contract.deployed();

  const { chainId } = await hre.ethers.provider.getNetwork();

  const deployer = contract.deployTransaction.from;
  const admin = await contract.admin();

  console.log("==============================================");
  console.log("CREDIVIR - CertificateVerification deployed");
  console.log("----------------------------------------------");
  console.log(`Contract address: ${contract.address}`);
  console.log(`Network:          ${hre.network.name}`);
  console.log(`Chain ID:         ${chainId}`);
  console.log(`Deployer:         ${deployer}`);
  console.log(`Admin:            ${admin}`);
  console.log(`Explorer URL:     ${getExplorerUrl(chainId, contract.address)}`);
  console.log("==============================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});