//staging tests are for testnets(sepolia,goerli,...) chains

const { DEVELOPMENT_CHAINS, networkConfig } = require("../../helper-hardhat-config");
const { network } = require("hardhat");

DEVELOPMENT_CHAINS.includes(network.name)
? describe.skip
: describe("Your Contract Name:", () => {
    // Your tests for the different parts of your contract
    



});
