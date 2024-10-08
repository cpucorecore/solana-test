import {SolanaClient} from "./SolanaClient";
import {ProgramCounter} from "./ProgramCounter";
import {createIncrementInstruction} from "../ts";
import {Transaction} from "@solana/web3.js";

export class CounterCaller {
    solanaClient: SolanaClient
    programCounter: ProgramCounter

    constructor(solanaClient: SolanaClient, programCounter: ProgramCounter) {
        this.solanaClient = solanaClient
        this.programCounter = programCounter
    }

    async callContractCount(count: number) {
        for (let i = 0; i < count; i++) {
            await this.callContract();
        }
    }

    async callContract() {
        const counter = this.programCounter.getCounter();
        const incrementIx = createIncrementInstruction({counter});
        let tx = new Transaction().add(incrementIx);
        tx.feePayer = this.solanaClient.getPayer();
        tx.recentBlockhash = this.solanaClient.context.lastBlockhash;

        tx.sign(this.solanaClient.getKeypair());

        await this.solanaClient.client.processTransaction(tx);
    }
}
