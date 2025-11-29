const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n📍 Deployer Address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "MATIC");
  
  if (parseFloat(hre.ethers.formatEther(balance)) < 0.1) {
    console.log("\n⚠️  WARNING: Balance is low! You need at least 0.1-0.2 MATIC for deployment.");
    console.log("   Send MATIC to:", deployer.address);
  } else {
    console.log("\n✅ Balance is sufficient for deployment!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
