import {SolanaClient} from "./SolanaClient";
import {ProgramCounter} from "./ProgramCounter";
import {SystemProgram, Transaction} from "@solana/web3.js";
import {COUNTER_ACCOUNT_SIZE, PROGRAM_ID} from "../ts";

export class CounterCreator {
    solanaClient: SolanaClient
    programCounter: ProgramCounter

    constructor(solanaClient: SolanaClient, programCounter: ProgramCounter) {
        this.solanaClient = solanaClient
        this.programCounter = programCounter
    }

    async createDataAccount() {
        const allocIx = SystemProgram.createAccount({
            fromPubkey: this.solanaClient.getPayer(),
            newAccountPubkey: this.programCounter.getCounter(),
            lamports: Number(this.solanaClient.getRent().minimumBalance(BigInt(COUNTER_ACCOUNT_SIZE))),
            space: COUNTER_ACCOUNT_SIZE,
            programId: PROGRAM_ID,
        });

        let tx = new Transaction().add(allocIx);
        tx.feePayer = this.solanaClient.getPayer();
        tx.recentBlockhash = this.solanaClient.context.lastBlockhash;

        tx.sign(this.solanaClient.getKeypair(), this.programCounter.counterKeypair);

        await this.solanaClient.client.processTransaction(tx);
    }
}
