const hre = require("hardhat");

async function main() {
  console.log("\n🔍 Checking Governor contract on Sepolia...\n");

  const governorAddress = "0x6660344dA659aAcA0a7733dd70499be7ffa9F4Fa";
  const tokenAddress = "0xf846380e25b34B71474543fdB28258F8477E2Cf1";
  
  const Governor = await hre.ethers.getContractAt("AethexGovernor", governorAddress);
  const Token = await hre.ethers.getContractAt("AethexToken", tokenAddress);

  console.log("📄 Governor Address:", governorAddress);
  console.log("📄 Token Address:", tokenAddress);
  console.log();

  try {
    const name = await Governor.name();
    console.log("✅ Governor Name:", name);
    
    const votingDelay = await Governor.votingDelay();
    console.log("✅ Voting Delay:", votingDelay.toString(), "blocks");
    
    const votingPeriod = await Governor.votingPeriod();
    console.log("✅ Voting Period:", votingPeriod.toString(), "blocks");
    
    const proposalThreshold = await Governor.proposalThreshold();
    console.log("✅ Proposal Threshold:", hre.ethers.formatEther(proposalThreshold), "AETH");
    
    const quorum = await Governor["quorumNumerator()"]();
    console.log("✅ Quorum:", quorum.toString() + "%");
    
    const tokenName = await Token.name();
    const tokenSymbol = await Token.symbol();
    console.log("✅ Token:", tokenName, `(${tokenSymbol})`);
    
    console.log("\n✅ All contracts are working correctly!");
    console.log("\n🔗 Tally Registration:");
    console.log("   URL: https://www.tally.xyz/add-a-dao");
    console.log("   Network: Ethereum Sepolia");
    console.log("   Governor: " + governorAddress);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
