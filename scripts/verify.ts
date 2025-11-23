import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { run } = hre;

async function main() {
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const files = fs.readdirSync(deploymentsDir);
  const latestFile = files.sort().reverse()[0];
  
  if (!latestFile) {
    console.error("No deployment file found!");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(
    fs.readFileSync(path.join(deploymentsDir, latestFile), "utf-8")
  );

  const { AethexToken, AethexTimelock, AethexGovernor } = deploymentInfo.contracts;

  console.log("Verifying AethexToken...");
  try {
    await run("verify:verify", {
      address: AethexToken,
      constructorArguments: [],
    });
    console.log("✅ AethexToken verified");
  } catch (error: any) {
    console.log("❌ AethexToken verification failed:", error.message);
  }

  console.log("\nVerifying AethexTimelock...");
  try {
    await run("verify:verify", {
      address: AethexTimelock,
      constructorArguments: [
        2 * 24 * 60 * 60,
        [],
        [],
        deploymentInfo.deployer,
      ],
    });
    console.log("✅ AethexTimelock verified");
  } catch (error: any) {
    console.log("❌ AethexTimelock verification failed:", error.message);
  }

  console.log("\nVerifying AethexGovernor...");
  try {
    await run("verify:verify", {
      address: AethexGovernor,
      constructorArguments: [AethexToken, AethexTimelock],
    });
    console.log("✅ AethexGovernor verified");
  } catch (error: any) {
    console.log("❌ AethexGovernor verification failed:", error.message);
  }

  console.log("\n✅ Verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
