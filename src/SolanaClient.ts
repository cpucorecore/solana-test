import {BanksClient, ProgramTestContext, Rent, start} from "solana-bankrun";
import {Keypair, PublicKey} from "@solana/web3.js";

export class SolanaClient {
    context: ProgramTestContext;
    client: BanksClient;
    payer: Keypair;
    rent: Rent;

    constructor(context: ProgramTestContext, rent: Rent) {
        this.context = context;
        this.client = context.banksClient;
        this.payer = context.payer;
        this.rent = rent;
    }

    getPayer(): PublicKey {
        return this.payer.publicKey
    }

    getKeypair(): Keypair {
        return this.payer;
    }

    getRent(): Rent {
        return this.rent;
    }
}
