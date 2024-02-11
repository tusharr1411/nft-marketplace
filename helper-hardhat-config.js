const networkConfig = {
    11155111: {
        name: "sepolia",
    },
    5: {
        name: "goerli",
    },
    137: {
        name: "polygon",
    },
    // local development chains
    1337: {
        name: "ganache",
    },
    31337: {
        name: "localhost",
    },
};

const DEVELOPMENT_CHAINS = ["hardhat", "localhost", "ganache"];

module.exports = { networkConfig, DEVELOPMENT_CHAINS };
