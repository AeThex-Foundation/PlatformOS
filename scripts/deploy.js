const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🚀 Deploying AeThex DAO to Polygon mainnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

  const votingDelay = 7200;
  const votingPeriod = 50400;
  const proposalThreshold = hre.ethers.parseEther("1000");
  const quorumPercentage = 4;
  const minDelay = 172800;

  console.log("📝 Deploying AethexToken...");
  const AethexToken = await hre.ethers.getContractFactory("AethexToken");
  const token = await AethexToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ AethexToken deployed to:", tokenAddress);

  console.log("\n📝 Deploying AethexTimelock...");
  const AethexTimelock = await hre.ethers.getContractFactory("AethexTimelock");
  const timelock = await AethexTimelock.deploy(minDelay, [], [], deployer.address);
  await token.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ AethexTimelock deployed to:", timelockAddress);

  console.log("\n📝 Deploying AethexGovernor...");
  const AethexGovernor = await hre.ethers.getContractFactory("AethexGovernor");
  const governor = await AethexGovernor.deploy(
    tokenAddress,
    timelockAddress,
    votingDelay,
    votingPeriod,
    proposalThreshold,
    quorumPercentage
  );
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("✅ AethexGovernor deployed to:", governorAddress);

  console.log("\n🔧 Setting up roles...");
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const DEFAULT_ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE();

  let tx = await timelock.grantRole(PROPOSER_ROLE, governorAddress);
  await tx.wait();
  console.log("✅ Granted PROPOSER_ROLE to Governor");

  tx = await timelock.grantRole(EXECUTOR_ROLE, hre.ethers.ZeroAddress);
  await tx.wait();
  console.log("✅ Granted EXECUTOR_ROLE to everyone (ZeroAddress)");

  tx = await timelock.grantRole(DEFAULT_ADMIN_ROLE, timelockAddress);
  await tx.wait();
  console.log("✅ Granted DEFAULT_ADMIN_ROLE to Timelock itself");

  tx = await timelock.revokeRole(DEFAULT_ADMIN_ROLE, deployer.address);
  await tx.wait();
  console.log("✅ Revoked DEFAULT_ADMIN_ROLE from deployer");

  const deploymentInfo = {
    network: "polygon",
    chainId: 137,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AethexToken: tokenAddress,
      AethexTimelock: timelockAddress,
      AethexGovernor: governorAddress
    },
    parameters: {
      votingDelay: votingDelay,
      votingPeriod: votingPeriod,
      proposalThreshold: hre.ethers.formatEther(proposalThreshold),
      quorumPercentage: quorumPercentage,
      timelockDelay: minDelay
    }
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `polygon-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  fs.writeFileSync(
    path.join(deploymentsDir, "latest.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✨ Deployment complete!");
  console.log("\n📄 Contract Addresses:");
  console.log("   Token:     ", tokenAddress);
  console.log("   Timelock:  ", timelockAddress);
  console.log("   Governor:  ", governorAddress);
  console.log("\n💾 Deployment info saved to:", filename);
  console.log("\n🔍 Next steps:");
  console.log("   1. Verify contracts: npx hardhat run scripts/verify.js --network polygon");
  console.log("   2. Register on Tally: https://www.tally.xyz/add-a-dao");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
