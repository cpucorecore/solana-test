import {loadKeypair} from "./src/KeypairFileLoader";
import {Connection} from '@solana/web3.js';
import {Counter} from "./src/Counter";

(async () => {
    const connection = new Connection('http://127.0.0.1:8899');
    const payerKeypair = loadKeypair("./keys/payer.json");
    const counterKeypair = loadKeypair("./keys/counter.json");
    console.log(`payer: ${payerKeypair.publicKey}`);
    console.log(`counterKeypair: ${counterKeypair.publicKey}`);

    const counter = new Counter(connection, payerKeypair, counterKeypair);

    await counter.dumpCounter();
    if (await counter.counterExist()) {
        for (let i = 0; i < 10; i++) {
            await counter.callContract();
            await sleep(500);
        }
    } else {
        await counter.createDataAccount();
    }

    await counter.dumpCounter();
})();

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
