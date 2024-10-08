import {Keypair, PublicKey} from "@solana/web3.js";
import {deserializeCounterAccount} from "../ts";
import {SolanaClient} from "./SolanaClient";

export class ProgramCounter {
    solanaClient: SolanaClient
    id: PublicKey
    counterKeypair: Keypair
    counter: PublicKey

    constructor(solanaClient: SolanaClient, id: PublicKey, counterKeypair: Keypair) {
        this.solanaClient = solanaClient;
        this.id = id;
        this.counterKeypair = counterKeypair;
        this.counter = counterKeypair.publicKey;
    }

    getCounter(): PublicKey {
        return this.counter;
    }

    async getState() {
        const counterAccountInfo = await this.solanaClient.client.getAccount(this.counter);
        if (counterAccountInfo) {
            console.log(counterAccountInfo);
            const counterAccount = deserializeCounterAccount(Buffer.from(counterAccountInfo.data));
            console.log(`[alloc+increment] count is: ${counterAccount.count.toNumber()}`);
            console.log(this.counter.toString());
        } else {
            console.log("not exist");
        }
    }
}
