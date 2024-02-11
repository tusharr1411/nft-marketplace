// we can't have these functions in our `helper-hardhat-config`
// since these use the hardhat library
// and it would be a circular dependency

const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
    console.log("Verifying the contract...");
    try {
        await run("verify:verify", {
            // verify is a task in hardhat
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified");
        } else {
            console.log(error);
        }
    }
};

module.exports = { verify };
