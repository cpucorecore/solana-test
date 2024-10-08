import { PROGRAM_ID } from './ts';
import {start} from "solana-bankrun";
import {ProgramCounter} from "./src/ProgramCounter";
import {loadKeypair} from "./src/KeypairFileLoader";
import {SolanaClient} from "./src/SolanaClient";
import {CounterCreator} from "./src/CounterCreator";
import {CounterCaller} from "./src/CounterCaller";

(async () => {
    const context = await start([{ name: 'counter_solana_native', programId: PROGRAM_ID }], []);
    const client = context.banksClient;
    const rent = await client.getRent();
    const solanaClient = new SolanaClient(context, rent);

    const counterKeypair = loadKeypair("./counter.json")
    const programCounter = new ProgramCounter(solanaClient, PROGRAM_ID, counterKeypair);

    let counterCreator = new CounterCreator(solanaClient, programCounter)

    await programCounter.getState()
    await counterCreator.createDataAccount()
    await programCounter.getState()

    let counterCaller = new CounterCaller(solanaClient, programCounter);
    await counterCaller.callContract()
    await programCounter.getState()

    console.log("begin sleep")
    await sleep(2000)
    console.log("end sleep")
    await counterCaller.callContract()
    await programCounter.getState()
})();

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
