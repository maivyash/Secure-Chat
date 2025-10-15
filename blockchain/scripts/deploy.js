const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying MilitaryAuth smart contract...");

  // Get the contract factory
  const MilitaryAuth = await hre.ethers.getContractFactory("MilitaryAuth");
  
  // Deploy the contract
  const militaryAuth = await MilitaryAuth.deploy();
  await militaryAuth.waitForDeployment();

  const contractAddress = await militaryAuth.getAddress();
  console.log("MilitaryAuth deployed to:", contractAddress);

  // Save contract address and ABI
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    deployer: (await hre.ethers.getSigners())[0].address
  };

  // Save to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Copy ABI to server
  const artifactPath = path.join(__dirname, "../artifacts/contracts/MilitaryAuth.sol/MilitaryAuth.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const serverAbiPath = path.join(__dirname, "../../server/blockchain/MilitaryAuth.json");
  const serverAbiDir = path.dirname(serverAbiPath);
  
  if (!fs.existsSync(serverAbiDir)) {
    fs.mkdirSync(serverAbiDir, { recursive: true });
  }
  
  fs.writeFileSync(
    serverAbiPath,
    JSON.stringify({
      abi: artifact.abi,
      contractAddress: contractAddress,
      network: hre.network.name
    }, null, 2)
  );

  console.log("Contract ABI saved to server directory");
  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("========================\n");

  // Verify on Etherscan (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await militaryAuth.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
