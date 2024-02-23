const { network } = require("hardhat");
function sleep(timeInMiliSecond) {
    return new Promise((resolve) => setTimeout(resolve, timeInMiliSecond));
}

//sleep amount is an optional parameter
// if we wanna move blocks and sleep (maybe a seconds) between block to resamble a real blockchain
async function moveBlocks(amount, sleepAmount = 0) {
    console.log("Moving blocks...");

    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        });
        if (sleepAmount) {
            console.log(`Sleeping for ${sleepAmount}`);
            await sleep(sleepAmount);
        }
    }
    console.log(`Moved ${amount} blocks`)
}

module.exports = {
    moveBlocks,
    sleep,
};
