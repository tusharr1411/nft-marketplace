const moveBlocks = require("../utils/move-blocks");

const BLOCKS = 2;
const SLEEP_AMOUNT = 1000;

async function main() {
    await moveBlocks(BLOCKS, (sleepAmount = SLEEP_AMOUNT));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
