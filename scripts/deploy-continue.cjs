const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🚀 Continuing AeThex DAO deployment on Polygon mainnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

  const minDelay = 172800;

  // Token already deployed
  const tokenAddress = "0xf846380e25b34B71474543fdB28258F8477E2Cf1";
  console.log("📍 Using existing AethexToken at:", tokenAddress);
  
  const AethexToken = await hre.ethers.getContractFactory("AethexToken");
  const token = AethexToken.attach(tokenAddress);

  console.log("\n📝 Deploying AethexTimelock...");
  const AethexTimelock = await hre.ethers.getContractFactory("AethexTimelock");
  const timelock = await AethexTimelock.deploy(minDelay, [], [], deployer.address);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ AethexTimelock deployed to:", timelockAddress);

  console.log("\n📝 Deploying AethexGovernor...");
  const AethexGovernor = await hre.ethers.getContractFactory("AethexGovernor");
  const governor = await AethexGovernor.deploy(
    tokenAddress,
    timelockAddress
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

  // Transfer all tokens to Ledger address
  const LEDGER_ADDRESS = "0x9A58610d3ad7A7399a4b9c5Dad440dA67FDE4DeF";
  const tokenBalance = await token.balanceOf(deployer.address);
  console.log("\n💰 Transferring tokens to Ledger...");
  console.log("   Ledger address:", LEDGER_ADDRESS);
  console.log("   Amount:", hre.ethers.formatEther(tokenBalance), "AETHEX");
  
  tx = await token.transfer(LEDGER_ADDRESS, tokenBalance);
  await tx.wait();
  console.log("✅ All AETHEX tokens transferred to Ledger!");

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
      votingDelay: 7200,
      votingPeriod: 50400,
      proposalThreshold: "1000",
      quorumPercentage: 4,
      timelockDelay: minDelay
    },
    ledgerAddress: LEDGER_ADDRESS
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `polygon-mainnet-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  fs.writeFileSync(
    path.join(deploymentsDir, "polygon-mainnet-latest.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✨ Deployment complete!");
  console.log("\n📄 Contract Addresses:");
  console.log("   Token:     ", tokenAddress);
  console.log("   Timelock:  ", timelockAddress);
  console.log("   Governor:  ", governorAddress);
  console.log("\n💾 Deployment info saved to:", filename);
  console.log("\n🔍 Next steps:");
  console.log("   1. Verify contracts on Polygonscan");
  console.log("   2. Register on Tally: https://www.tally.xyz/add-a-dao");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
