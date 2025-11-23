import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const minDelay = 2 * 24 * 60 * 60;

  console.log("\n1. Deploying AethexToken...");
  const AethexToken = await ethers.getContractFactory("AethexToken");
  const token = await AethexToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ AethexToken deployed to:", tokenAddress);

  console.log("\n2. Deploying AethexTimelock...");
  const AethexTimelock = await ethers.getContractFactory("AethexTimelock");
  const timelock = await AethexTimelock.deploy(
    minDelay,
    [],
    [],
    deployer.address
  );
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ AethexTimelock deployed to:", timelockAddress);

  console.log("\n3. Deploying AethexGovernor...");
  const AethexGovernor = await ethers.getContractFactory("AethexGovernor");
  const governor = await AethexGovernor.deploy(tokenAddress, timelockAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("✅ AethexGovernor deployed to:", governorAddress);

  console.log("\n4. Setting up roles...");
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();
  const DEFAULT_ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE();

  console.log("   - Granting PROPOSER_ROLE to Governor...");
  await timelock.grantRole(PROPOSER_ROLE, governorAddress);
  
  console.log("   - Granting EXECUTOR_ROLE to zero address (anyone can execute)...");
  await timelock.grantRole(EXECUTOR_ROLE, ethers.ZeroAddress);
  
  console.log("   - Granting CANCELLER_ROLE to Governor...");
  await timelock.grantRole(CANCELLER_ROLE, governorAddress);
  
  console.log("   - Revoking deployer admin role...");
  await timelock.revokeRole(DEFAULT_ADMIN_ROLE, deployer.address);
  
  console.log("✅ Roles configured successfully");

  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AethexToken: tokenAddress,
      AethexTimelock: timelockAddress,
      AethexGovernor: governorAddress,
    },
    governance: {
      votingDelay: "1 day",
      votingPeriod: "1 week",
      proposalThreshold: "1000 AETH",
      quorum: "4%",
      timelockDelay: "2 days",
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `deployment-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", deploymentInfo.network);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("\n📜 CONTRACT ADDRESSES:");
  console.log("  Token:", deploymentInfo.contracts.AethexToken);
  console.log("  Timelock:", deploymentInfo.contracts.AethexTimelock);
  console.log("  Governor:", deploymentInfo.contracts.AethexGovernor);
  console.log("\n⚙️  GOVERNANCE PARAMETERS:");
  console.log("  Voting Delay:", deploymentInfo.governance.votingDelay);
  console.log("  Voting Period:", deploymentInfo.governance.votingPeriod);
  console.log("  Proposal Threshold:", deploymentInfo.governance.proposalThreshold);
  console.log("  Quorum:", deploymentInfo.governance.quorum);
  console.log("  Timelock Delay:", deploymentInfo.governance.timelockDelay);
  console.log("\n💾 Deployment info saved to:", filename);
  console.log("=".repeat(60));
  console.log("\n🎯 NEXT STEPS:");
  console.log("1. Verify contracts on Polygonscan");
  console.log("2. Register your DAO at https://www.tally.xyz/add-a-dao");
  console.log("3. Delegate tokens to enable voting");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
