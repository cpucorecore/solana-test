import {COUNTER_ACCOUNT_SIZE, deserializeCounterAccount, PROGRAM_ID} from './ts';
import {loadKeypair} from "./src/KeypairFileLoader";
import {Connection, SystemProgram, Transaction, TransactionMessage, VersionedTransaction} from '@solana/web3.js';


(async () => {
    const connection = new Connection('http://127.0.0.1:8899');
    const payer = await loadKeypair("./payer.json");
    console.log(payer.publicKey.toString());
    const counterKeypair = await loadKeypair("./counter.json")
    let  accountInfo = await connection.getAccountInfo(counterKeypair.publicKey);
    console.log(accountInfo);
    if (accountInfo) {
        const counterAccount = deserializeCounterAccount(Buffer.from(accountInfo.data));
        console.log(`[alloc+increment] count is: ${counterAccount.count.toNumber()}`);
    }


    const exemptionBalance = await connection.getMinimumBalanceForRentExemption(COUNTER_ACCOUNT_SIZE);
    const allocIx = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: counterKeypair.publicKey,
        lamports: exemptionBalance,
        space: COUNTER_ACCOUNT_SIZE,
        programId: PROGRAM_ID,
    });

    const lastBlockHash = await connection.getLatestBlockhash()
    // let tx = new Transaction().add(allocIx);
    // tx.feePayer = payer.publicKey
    // tx.recentBlockhash = lastBlockHash.blockhash
    //
    // tx.sign(payer, counterKeypair);

    const instructions = [
        allocIx
    ];
    const msg = new TransactionMessage({
        payerKey:payer.publicKey,
        recentBlockhash: lastBlockHash.blockhash,
        instructions,
    }).compileToV0Message();


    const t = new VersionedTransaction(msg);
    t.sign([payer, counterKeypair])
    const sb = await connection.sendTransaction(t);
    console.log(sb)

      accountInfo = await connection.getAccountInfo(counterKeypair.publicKey);
    console.log(accountInfo);
    if (accountInfo) {
        const counterAccount = deserializeCounterAccount(Buffer.from(accountInfo.data));
        console.log(`[alloc+increment] count is: ${counterAccount.count.toNumber()}`);
    }

})();

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
