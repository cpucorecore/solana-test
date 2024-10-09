import {
    Connection,
    Keypair,
    SystemProgram,
    TransactionMessage,
    VersionedTransaction
} from "@solana/web3.js";
import {COUNTER_ACCOUNT_SIZE, createIncrementInstruction, deserializeCounterAccount, PROGRAM_ID} from "./ts";

export class Counter {
    connection: Connection
    payerKeypair: Keypair
    counterKeypair: Keypair

    constructor(connection: Connection, payerKeypair: Keypair, counterKeypair: Keypair) {
        this.connection = connection;
        this.payerKeypair = payerKeypair;
        this.counterKeypair = counterKeypair;
    }

    async createDataAccount() {
        const exemptionBalance = await this.connection.getMinimumBalanceForRentExemption(COUNTER_ACCOUNT_SIZE);
        const createAccountInstruction = SystemProgram.createAccount({
            fromPubkey: this.payerKeypair.publicKey,
            newAccountPubkey: this.counterKeypair.publicKey,
            lamports: exemptionBalance,
            space: COUNTER_ACCOUNT_SIZE,
            programId: PROGRAM_ID,
        });

        const instructions = [
            createAccountInstruction
        ];

        const lastBlockHash = await this.connection.getLatestBlockhash()
        const msg = new TransactionMessage({
            payerKey: this.payerKeypair.publicKey,
            recentBlockhash: lastBlockHash.blockhash,
            instructions,
        }).compileToV0Message();

        const tx = new VersionedTransaction(msg);
        tx.sign([this.payerKeypair, this.counterKeypair])
        const txId = await this.connection.sendTransaction(tx);
        console.log(txId)
    }

    async callContract() {
        const incrementInstruction = createIncrementInstruction({counter: this.counterKeypair.publicKey});
        const instructions = [
            incrementInstruction
        ];

        const lastBlockHash = await this.connection.getLatestBlockhash()
        const msg = new TransactionMessage({
            payerKey: this.payerKeypair.publicKey,
            recentBlockhash: lastBlockHash.blockhash,
            instructions,
        }).compileToV0Message();

        const tx = new VersionedTransaction(msg);
        tx.sign([this.payerKeypair])
        const txId = await this.connection.sendTransaction(tx);
        console.log(txId)
    }

    async dumpCounter() {
        let accountInfo = await this.connection.getAccountInfo(this.counterKeypair.publicKey);
        if (accountInfo) {
            const counterAccount = deserializeCounterAccount(Buffer.from(accountInfo.data));
            console.log(`count is: ${counterAccount.count.toNumber()}`);
        } else {
            console.log("counter not exist")
        }
    }

    async counterExist(): Promise<boolean> {
        let accountInfo = await this.connection.getAccountInfo(this.counterKeypair.publicKey);
        return accountInfo != null;
    }
}
