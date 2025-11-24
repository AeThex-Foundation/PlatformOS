const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🔍 Verifying AeThex DAO contracts on Sepolia...\n");

  const latestPath = path.join(__dirname, "..", "deployments", "latest.json");
  
  if (!fs.existsSync(latestPath)) {
    console.error("❌ No deployment found. Run deploy.cjs first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(latestPath, "utf8"));
  const { AethexToken, AethexTimelock, AethexGovernor } = deployment.contracts;
  
  console.log("📄 Contract Addresses:");
  console.log("   Token:    ", AethexToken);
  console.log("   Timelock: ", AethexTimelock);
  console.log("   Governor: ", AethexGovernor);
  console.log();

  const [deployer] = await hre.ethers.getSigners();

  try {
    console.log("1️⃣ Verifying AethexToken...");
    await hre.run("verify:verify", {
      address: AethexToken,
      contract: "contracts/AethexToken.sol:AethexToken",
      constructorArguments: [],
    });
    console.log("✅ AethexToken verified!\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ AethexToken already verified!\n");
    } else {
      console.error("❌ Error verifying Token:", error.message, "\n");
    }
  }

  try {
    console.log("2️⃣ Verifying AethexTimelock...");
    await hre.run("verify:verify", {
      address: AethexTimelock,
      contract: "contracts/AethexTimelock.sol:AethexTimelock",
      constructorArguments: [
        172800,
        [],
        [],
        deployer.address
      ],
    });
    console.log("✅ AethexTimelock verified!\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ AethexTimelock already verified!\n");
    } else {
      console.error("❌ Error verifying Timelock:", error.message, "\n");
    }
  }

  try {
    console.log("3️⃣ Verifying AethexGovernor...");
    await hre.run("verify:verify", {
      address: AethexGovernor,
      contract: "contracts/AethexGovernor.sol:AethexGovernor",
      constructorArguments: [
        AethexToken,
        AethexTimelock
      ],
    });
    console.log("✅ AethexGovernor verified!\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ AethexGovernor already verified!\n");
    } else {
      console.error("❌ Error verifying Governor:", error.message, "\n");
    }
  }

  console.log("🎉 Verification complete!");
  console.log("\n🔗 View on Sepolia Etherscan:");
  console.log("   Token:    ", `https://sepolia.etherscan.io/address/${AethexToken}#code`);
  console.log("   Timelock: ", `https://sepolia.etherscan.io/address/${AethexTimelock}#code`);
  console.log("   Governor: ", `https://sepolia.etherscan.io/address/${AethexGovernor}#code`);
  console.log("\n✅ Next: Register on Tally: https://www.tally.xyz/add-a-dao");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
